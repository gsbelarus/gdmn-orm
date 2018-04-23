import { DBStructure, IRefConstraints, FKConstraint, Relation, FieldType, ATransaction } from 'gdmn-db';
import * as erm from '../ermodel';
import * as rdbadapter from '../rdbadapter';
import { LName } from '../types';
import { load } from './atdata';
import { default2Int, default2Number, default2Date } from './util';

export async function erExport(dbs: DBStructure, transaction: ATransaction, erModel: erm.ERModel): Promise<erm.ERModel> {

  const { atfields, atrelations } = await load(transaction);

  /**
   * Если имя генератора совпадает с именем объекта в БД, то адаптер можем не указывать.
   */

  const GDGUnique = erModel.addSequence(new erm.Sequence('GD_G_UNIQUE'));
  const GDGOffset = erModel.addSequence(new erm.Sequence('Offset', { sequence: 'GD_G_OFFSET' }));

  function createEntity(relation: Relation, entityName?: string, attributes?: erm.Attribute[]): erm.Entity {

    const found = Object.entries(erModel.entities).find( e => {
      const adapter = e[1].adapter;
      if (adapter) {
        if (Array.isArray(adapter.relation)) {
          return !!adapter.relation.find(
            (r: rdbadapter.Relation) => r.relationName === relation.name && !r.weak
          );
        } else {
          return adapter.relation.relationName === relation.name;
        }
      } else {
        return e[0] === relation.name;
      }
    });

    if (found) {
      return found[1];
    }

    const pkFields = relation.primaryKey!.fields.join();

    const parent = Object.entries(relation.foreignKeys).reduce(
      (p: erm.Entity | undefined, fk) => {
        if (!p && fk[1].fields.join() === pkFields) {
          return createEntity(dbs.relationByUqConstraint(fk[1].constNameUq));
        } else {
          return p;
        }
      },
      undefined
    );

    const rf = relation.relationFields;
    const structure: rdbadapter.RelationStructure = rf['PARENT'] ?
      (rf['LB'] && rf['RB'] ? 'LBRB' : 'TREE' ) : 'PLAIN';
    const adapter: rdbadapter.Entity2RelationMap = {
      relation: {
        relationName: relation.name,
        structure
      }
    };
    const setEntityName = entityName ? entityName : relation.name;

    const entity = new erm.Entity(
      parent,
      setEntityName,
      atrelations[relation.name].lName,
      false,
      setEntityName !== relation.name || structure !== 'PLAIN' ? adapter : undefined
    );

    if (!parent) {
      entity.add(
        new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
      );
    };

    if (attributes) {
      attributes.forEach( attr => entity.add(attr) );
    }

    return erModel.add(entity);
  };

  /**
   * Простейший случай таблицы. Никаких ссылок.
   * -- Если имя Entity совпадает с именем таблицы и ее структура PLAIN, то можем не указывать адаптер.
   * -- Первое добавляемое поле в Entity автоматом становится PK.
   * -- Если имя атрибута совпадает с именем поля, то в адаптере имя поля можно не указывать.
   */

  createEntity(dbs.relations.WG_HOLIDAY);

  /**
   * Административно-территориальная единица.
   * Тут исключительно для иллюстрации типа данных Перечисление.
   */
  createEntity(dbs.relations.GD_PLACE, undefined, [
    new erm.EnumAttribute('PLACETYPE', {ru: {name: 'Тип'}}, true,
      [
        {
          value: 'Область'
        },
        {
          value: 'Район'
        },
      ],
      'Область'
    )
  ]);

  /**
   * @todo Parse fields CHECK constraint and extract min and max allowed values.
   */

  function createAttributes(entity: erm.Entity) {
    const relations: Relation[] = [];

    if (!entity.adapter) {
      relations.push(dbs.relations[entity.name]);
    } else {
      if (Array.isArray(entity.adapter.relation)) {
        entity.adapter.relation.forEach(
          ar => relations.push(dbs.relations[ar.relationName])
        );
      } else {
        relations.push(dbs.relations[entity.adapter.relation.relationName]);
      }
    }

    relations.forEach( r => {
      if (!r.primaryKey) return;

      Object.entries(r.relationFields).forEach( rf => {
        if (r.primaryKey!.fields.find( f => f === rf[0] )) return;

        if (rf[0] === 'LB' || rf[0] === 'RB') return;

        if (entity.hasOwnAttribute(rf[0])) return;

        const attributeName = entity.hasAttribute(rf[0]) ? `${r.name}.${rf[0]}` : rf[0];
        const fieldSource = dbs.fields[rf[1].fieldSource];
        const lName = atrelations[r.name].relationFields[rf[1].name].lName;
        const required: boolean = rf[1].notNull || fieldSource.notNull;
        const defaultValue: string | null = rf[1].defaultValue || fieldSource.defaultValue;
        const adapter: rdbadapter.Attribute2FieldMap | undefined =
          relations.length > 1 ? {relation: r.name, field: rf[0]} : undefined;

        const attr = ( () => {
          switch (rf[1].fieldSource) {
            case 'DEDITIONDATE':
              return new erm.TimeStampAttribute(attributeName, {ru: {name: 'Изменено'}}, true,
                new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)',
                adapter
              );
            case 'DCREATIONDATE':
              return new erm.TimeStampAttribute(attributeName, {ru: {name: 'Создано'}}, true,
                new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)',
                adapter
              );
            case 'DDOCUMENTDATE':
              return new erm.TimeStampAttribute(attributeName, {ru: {name: 'Дата документа'}}, true,
                new Date('1900-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)',
                adapter
              );
            case 'DQUANTITY': return new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter);
            case 'DLAT': return new erm.NumericAttribute(attributeName, lName, false, 10, 8, -90, +90, undefined, adapter);
            case 'DLON': return new erm.NumericAttribute(attributeName, lName, false, 11, 8, -180, +180, undefined, adapter);
            case 'DCURRENCY': return new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter);
            case 'DPOSITIVE': return new erm.NumericAttribute(attributeName, lName, false, 15, 8, 0, undefined, undefined, adapter);
            case 'DPERCENT': return new erm.NumericAttribute(attributeName, lName, false, 7, 4, undefined, undefined, undefined, adapter);
            case 'DTAX': return new erm.NumericAttribute(attributeName, lName, false, 7, 4, 0, 99, undefined, adapter);
            case 'DDECDIGITS': return new erm.IntegerAttribute(attributeName, lName, false, 0, 16, undefined, adapter);
            case 'DACCOUNTTYPE': return new erm.EnumAttribute(attributeName, lName, false, [{value: 'D'}, {value: 'K'}], undefined, adapter);
            case 'DGENDER': return new erm.EnumAttribute(attributeName, lName, false, [{value: 'M'}, {value: 'F'}, {value: 'N'}], undefined, adapter);
            case 'DTEXTALIGNMENT': return new erm.EnumAttribute(attributeName, lName, false,
              [{value: 'L'}, {value: 'R'}, {value: 'C'}, {value: 'J'}], 'L', adapter);
            case 'DSECURITY': return new erm.IntegerAttribute(attributeName, lName, true, undefined, undefined, -1, adapter);
            case 'DDISABLED': return new erm.BooleanAttribute(attributeName, lName, false, false, adapter);
            case 'DBOOLEAN': return new erm.BooleanAttribute(attributeName, lName, false, false, adapter);
            case 'DBOOLEAN_NOTNULL': return new erm.BooleanAttribute(attributeName, lName, true, false, adapter);
            // следующие домены надо проверить, возможно уже нигде и не используются
            case 'DTYPETRANSPORT': return new erm.EnumAttribute(attributeName, lName, false,
              [{value: 'C'}, {value: 'S'}, {value: 'R'}, {value: 'O'}, {value: 'W'}], undefined, adapter);
            case 'DGOLDQUANTITY': return new erm.NumericAttribute(attributeName, lName, false, 15, 8, undefined, undefined, undefined, adapter);
          }

          if (fieldSource.fieldScale < 0) {
            const factor = Math.pow(10, fieldSource.fieldScale);
            let MaxValue;
            let MinValue;

            switch (fieldSource.fieldType) {
              case FieldType.SMALL_INTEGER:
                MaxValue = rdbadapter.MAX_16BIT_INT * factor;
                MinValue = rdbadapter.MIN_16BIT_INT * factor;
                break;

              case FieldType.INTEGER:
                MaxValue = rdbadapter.MAX_32BIT_INT * factor;
                MinValue = rdbadapter.MIN_32BIT_INT * factor;
                break;

              default:
                MaxValue = rdbadapter.MAX_64BIT_INT * factor;
                MinValue = rdbadapter.MIN_64BIT_INT * factor;
            }

            return new erm.NumericAttribute(attributeName, lName, required,
              fieldSource.fieldPrecision,
              fieldSource.fieldScale,
              MinValue, MaxValue,
              default2Number(defaultValue),
              adapter);
          }

          switch (fieldSource.fieldType) {
            case FieldType.INTEGER:
            {
              const fk = Object.entries(r.foreignKeys).find(
                f => !!f[1].fields.find( fld => fld === attributeName )
              );

              if (fk && fk[1].fields.length === 1) {
                return new erm.EntityAttribute(attributeName, lName, required,
                  [createEntity(dbs.relationByUqConstraint(fk[1].constNameUq))],
                  adapter);
              } else {
                return new erm.IntegerAttribute(attributeName, lName, required,
                  rdbadapter.MIN_32BIT_INT, rdbadapter.MAX_32BIT_INT,
                  default2Int(defaultValue),
                  adapter);
              }
            }

            case FieldType.CHAR:
            case FieldType.VARCHAR:
            {
              if (fieldSource.fieldLength === 1 && fieldSource.validationSource) {
                const enumValues = [];
                const reValueIn = /CHECK\s*\((\(VALUE IS NULL\) OR )?(\(VALUE\s+IN\s*\(\s*){1}((?:\'[A-Z0-9]\'(?:\,\s*)?)+)\)\)\)/;
                let match;
                if (match = reValueIn.exec(fieldSource.validationSource)) {
                  const reEnumValue = /\'([A-Z0-9]{1})\'/g;
                  let enumValue;
                  while (enumValue = reEnumValue.exec(match[3])) {
                    enumValues.push({value: enumValue[1]});
                  }
                }

                if (enumValues.length) {
                  return new erm.EnumAttribute(attributeName, lName, required, enumValues, undefined, adapter);
                } else {
                  console.log(JSON.stringify(fieldSource.validationSource));
                }
              }

              return new erm.StringAttribute(attributeName, lName, required, undefined,
                fieldSource.fieldLength, undefined, true, undefined, adapter);
            }

            case FieldType.TIMESTAMP:
              return new erm.TimeStampAttribute(
                attributeName, lName, required, undefined, undefined, default2Date(defaultValue), adapter
              );

            case FieldType.DATE:
              return new erm.DateAttribute(
                attributeName, lName, required, undefined, undefined, default2Date(defaultValue), adapter
              );

            case FieldType.TIME:
              return new erm.TimeAttribute(
                attributeName, lName, required, undefined, undefined, default2Date(defaultValue), adapter
              );

            case FieldType.FLOAT:
            case FieldType.DOUBLE:
              return new erm.FloatAttribute(
                attributeName, lName, required,
                undefined, undefined,
                default2Number(defaultValue),
                adapter
              );

            case FieldType.SMALL_INTEGER:
              return new erm.IntegerAttribute(
                attributeName, lName, required,
                rdbadapter.MIN_16BIT_INT, rdbadapter.MAX_16BIT_INT,
                default2Int(defaultValue),
                adapter
              );

            case FieldType.BIG_INTEGER:
              return new erm.IntegerAttribute(
                attributeName, lName, required,
                rdbadapter.MIN_64BIT_INT, rdbadapter.MAX_64BIT_INT,
                default2Int(defaultValue),
                adapter
              );

            case FieldType.BLOB:
              if (fieldSource.fieldSubType === 1) {
                return new erm.StringAttribute(
                  attributeName, lName, required, undefined,
                  undefined, undefined, false, undefined,
                  adapter
                );
              } else {
                return new erm.BLOBAttribute(attributeName, lName, required, adapter);
              }

            default:
              console.log(`Unknown data type ${fieldSource}=${fieldSource.fieldType} for field ${r.name}.${attributeName}`);
              return undefined;
              // throw new Error('Unknown data type for field ' + r.name + '.' + attributeName);
          }
        })();

        if (attr) {
          entity.add(attr);
        }
      });

      Object.entries(r.unique).forEach( uq => {
        entity.addUnique(uq[1].fields.map( f => entity.attribute(f) ));
      });
    });
  }

  /*
  dbs.forEachRelation( r => {
    if (r.primaryKey && r.primaryKey.fields.join() === 'ID' && /^USR\$.+$/.test(r.name)) {
      createEntity(r);
    }
  });
  */

  Object.entries(erModel.entities).forEach( e => createAttributes(e[1]) );

  return erModel;
}