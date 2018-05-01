import { DBStructure, IRefConstraints, FKConstraint, Relation, FieldType, ATransaction, RelationField, Field } from 'gdmn-db';
import * as erm from '../ermodel';
import * as rdbadapter from '../rdbadapter';
import { LName } from '../types';
import { load, atField, atRelationField } from './atdata';
import { default2Int, default2Number, default2Date } from './util';

export async function erExport(dbs: DBStructure, transaction: ATransaction, erModel: erm.ERModel): Promise<erm.ERModel> {

  const { atfields, atrelations } = await load(transaction);

  const crossRelationsAdapters: rdbadapter.CrossRelations = {
    'GD_CONTACTLIST': {
      owner: 'GD_CONTACT',
      selector: {
        field: 'CONTACTTYPE',
        value: 1
      }

    }
  };

  /**
   * Если имя генератора совпадает с именем объекта в БД, то адаптер можем не указывать.
   */

  const GDGUnique = erModel.addSequence(new erm.Sequence('GD_G_UNIQUE'));
  const GDGOffset = erModel.addSequence(new erm.Sequence('Offset', { sequence: 'GD_G_OFFSET' }));

  function findEntities(relationName: string, selectors: rdbadapter.EntitySelector[] = []): erm.Entity[] {
    const found = Object.entries(erModel.entities).reduce( (p, e) => {
      if (e[1].adapter) {
        rdbadapter.adapter2array(e[1].adapter).forEach( r => {
          if (r.relationName === relationName && !rdbadapter.isWeakRelation(r)) {
            if (r.selector && selectors.length) {
              if (selectors.find( s => s.field === r.selector!.field && s.value === r.selector!.value )) {
                p.push(e[1]);
              }
            } else {
              p.push(e[1]);
            }
          }
        });
      }

      return p;
    }, [] as erm.Entity[]);

    while (found.length) {
      const descendant = found.findIndex( d => !!found.find( a => a !== d && d.hasAncestor(a) ) );
      if (descendant === -1) break;
      found.splice(descendant, 1);
    }

    return found;
  }

  function createEntity(parent: erm.Entity | undefined, adapter: rdbadapter.Entity2RelationMap,
    abstract?: boolean, entityName?: string, lName?: LName, attributes?: erm.Attribute[]): erm.Entity
  {
    const found = Object.entries(erModel.entities).find( e => rdbadapter.sameAdapter(adapter, e[1].adapter) );

    if (found) {
      return found[1];
    }

    const relation = rdbadapter.adapter2array(adapter).filter( r => !rdbadapter.isWeakRelation(r) ).reverse()[0];

    if (!relation || !relation.relationName) {
      throw new Error('Invalid entity adapter');
    }

    const setEntityName = entityName ? entityName : relation.relationName;
    const atRelation = atrelations[relation.relationName];
    const fake = rdbadapter.relationName2Adapter(setEntityName);

    const entity = new erm.Entity(
      parent,
      setEntityName,
      lName ? lName : (atRelation ? atRelation.lName : {}),
      !!abstract,
      JSON.stringify(adapter) !== JSON.stringify(fake) ? adapter : undefined
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
   */

  createEntity(undefined, rdbadapter.relationName2Adapter('WG_HOLIDAY'));

  /**
   * Административно-территориальная единица.
   * Тут исключительно для иллюстрации типа данных Перечисление.
   */
  createEntity(undefined, rdbadapter.relationName2Adapter('GD_PLACE'), false, undefined, undefined,
  [
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
   * Папка из справочника контактов.
   * Основывается на таблице GD_CONTACT, но использует только несколько полей из нее.
   * Записи имеют признак CONTACTTYPE = 0.
   * Имеет древовидную структуру.
   */
  const Folder = createEntity(undefined,
    {
      relation: {
        relationName: 'GD_CONTACT',
        selector: {
          field: 'CONTACTTYPE',
          value: 0,
        },
        fields: [
          'PARENT',
          'NAME'
        ]
      }
    },
    false,
    'Folder', {ru: {name: 'Папка'}}
  );
  Folder.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );

  /**
   * Компания хранится в трех таблицах.
   * Две обязательные GD_CONTACT - GD_COMPANY. В адаптере они указываются
   * в массиве relation и соединяются в запросе оператором JOIN.
   * Первой указывается главная таблица. Остальные таблицы называются
   * дополнительными. Первичный ключ дополнительной таблицы
   * должен одновременно являться внешним ключем на главную.
   * Третья -- GD_COMPANYCODE -- необязательная. Подключается через LEFT JOIN.
   * Для атрибутов из главной таблицы можно не указывать адаптер, если их имя
   * совпадает с именем поля.
   * Флаг refresh означает, что после вставки/изменения записи ее надо перечитать.
   */
  const Company = createEntity(undefined,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          selector: {
            field: 'CONTACTTYPE',
            value: 3
          }
        },
        {
          relationName: 'GD_COMPANY'
        },
        {
          relationName: 'GD_COMPANYCODE',
          weak: true
        }
      ],
      refresh: true
    },
    false,
    'Company', {ru: {name: 'Организация'}}, [
      new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder]),
      new erm.StringAttribute('NAME', {ru: {name: 'Краткое наименование'}}, true, undefined, 60, undefined, true, undefined)
    ]
  );

  /**
   * Банк является частным случаем компании (наследуется от компании).
   * Все атрибуты компании являются и атрибутами банка и не нуждаются
   * в повторном определении, за тем исключением, если мы хотим что-то
   * поменять в параметрах атрибута.
   */
  const Bank = createEntity(Company,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          selector: {
            field: 'CONTACTTYPE',
            value: 5
          }
        },
        {
          relationName: 'GD_COMPANY'
        },
        {
          relationName: 'GD_COMPANYCODE',
          weak: true
        },
        {
          relationName: 'GD_BANK'
        }
      ],
      refresh: true
    },
    false,
    'Bank', {ru: {name: 'Банк'}},
  );

  /**
   * Подразделение организации может входить (через поле Parent) в
   * организацию (компания, банк) или в другое подразделение.
   */
  const Department = createEntity(undefined,
    {
      relation: {
        relationName: 'GD_CONTACT',
        selector: {
          field: 'CONTACTTYPE',
          value: 4
        }
      }
    },
    false,
    'Department', {ru: {name: 'Подразделение'}}
  );
  Department.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в организацию (подразделение)'}}, [Company, Department])
  );
  Department.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );

  /**
   * Физическое лицо хранится в двух таблицах GD_CONTACT - GD_PEOPLE.
   */
  const Person = createEntity(undefined,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          selector: {
            field: 'CONTACTTYPE',
            value:2
          }
        },
        {
          relationName: 'GD_PEOPLE'
        }
      ],
      refresh: true
    },
    false,
    'Person', {ru: {name: 'Физическое лицо'}}
  );
  Person.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  Person.add(
    new erm.StringAttribute('NAME', {ru: {name: 'ФИО'}}, true, undefined, 60, undefined, true, undefined)
  );

  /**
   * Сотрудник, частный случай физического лица.
   * Добавляется таблица GD_EMPLOYEE.
   */
  const Employee = createEntity(Person,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          selector: {
            field: 'CONTACTTYPE',
            value:2
          }
        },
        {
          relationName: 'GD_PEOPLE'
        },
        {
          relationName: 'GD_EMPLOYEE'
        }
      ]
    },
    false,
    'Employee', {ru: {name: 'Сотрудник предприятия'}}
  );
  Employee.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Организация или подразделение'}}, [Company, Department])
  );

  /**
   * Группа контактов.
   * CONTACTLIST -- множество, которое хранится в кросс-таблице.
   */
  const Group = createEntity(undefined,
    {
      relation:
        {
          relationName: 'GD_CONTACT',
          selector: {
            field: 'CONTACTTYPE',
            value: 1
          },
          fields: [
            'PARENT',
            'NAME'
          ]
        }
    },
    false,
    'Group', {ru: {name: 'Группа'}},
  );
  Group.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  const ContactList =
    Group.add(
      new erm.SetAttribute('CONTACTLIST', {ru: {name: 'Контакты'}}, false, [Company, Person], 0,
        {
          crossRelation: 'GD_CONTACTLIST'
        }
      )
    ) as erm.SetAttribute;

  const companyAccount = createEntity(undefined, rdbadapter.relationName2Adapter('GD_COMPANYACCOUNT'));
  createEntity(undefined, rdbadapter.relationName2Adapter('GD_COMPACCTYPE'));
  createEntity(undefined, rdbadapter.relationName2Adapter('GD_CURR'));
  createEntity(undefined, rdbadapter.relationName2Adapter('WG_POSITION'));

  Company.add(
    new erm.DetailAttribute('GD_COMPANYACCOUNT', {ru: {name: 'Банковские счета'}}, false, [companyAccount])
  );

  const document = createEntity(undefined, rdbadapter.relationName2Adapter('GD_DOCUMENT'), true);
  const userDocument = createEntity(document, rdbadapter.relationName2Adapter('GD_DOCUMENT'), true);
  const invDocument = createEntity(document, rdbadapter.relationName2Adapter('GD_DOCUMENT'), true);
  const invPriceListDocument = createEntity(document, rdbadapter.relationName2Adapter('GD_DOCUMENT'), true);

  function recursInherited(parentRelation: Relation[], parentEntity: erm.Entity) {
    dbs.forEachRelation( inherited => {
      if (Object.entries(inherited.foreignKeys).find(
        ([name, f]) => f.fields.join() === inherited.primaryKey!.fields.join()
          && dbs.relationByUqConstraint(f.constNameUq) === parentRelation[parentRelation.length - 1] ))
      {
        const newParent = [...parentRelation, inherited];
        recursInherited(newParent, createEntity(parentEntity,
          rdbadapter.appendAdapter(parentEntity.adapter, inherited.name), false,
          inherited.name, atrelations[inherited.name] ? atrelations[inherited.name].lName : {}));
      }
    }, true);
  };

  dbs.forEachRelation( r => {
    if (r.primaryKey!.fields.join() === 'ID' && /^USR\$.+$/.test(r.name)) {
      recursInherited([r], createEntity(undefined, rdbadapter.relationName2Adapter(r.name)));
    }
  }, true);

  function createAttribute(r: Relation,
    rf: RelationField,
    atRelationField: atRelationField | undefined,
    attributeName: string,
    adapter: rdbadapter.Attribute2FieldMap | undefined)
  {
    const atField = atfields[rf.fieldSource];
    const fieldSource = dbs.fields[rf.fieldSource];
    const required: boolean = rf.notNull || fieldSource.notNull;
    const defaultValue: string | null = rf.defaultValue || fieldSource.defaultValue;
    const lName = atRelationField ? atRelationField.lName : (atField ? atField.lName : {});

    switch (rf.fieldSource) {
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

      if (fieldSource.validationSource) {
        console.warn(`Not processed for ${attributeName}: ${JSON.stringify(fieldSource.validationSource)}`);
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
          ([name, f]) => !!f.fields.find( fld => fld === attributeName )
        );

        if (fk && fk[1].fields.length === 1) {
          const refRelationName = dbs.relationByUqConstraint(fk[1].constNameUq).name;
          const cond = atField && atField.refCondition ? rdbadapter.condition2Selectors(atField.refCondition) : undefined;
          const refEntities = findEntities(refRelationName, cond);

          if (!refEntities.length) {
            // throw new Error(`No entities for table ${refRelationName}, condition: ${JSON.stringify(cond)}`);
            console.warn(`No entities for table ${refRelationName}, condition: ${JSON.stringify(cond)}`);
          }

          return new erm.EntityAttribute(attributeName, lName, required, refEntities, adapter);
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
            console.warn(`Not processed for ${attributeName}: ${JSON.stringify(fieldSource.validationSource)}`);
          }
        } else {
          if (fieldSource.validationSource) {
            console.warn(`Not processed for ${attributeName}: ${JSON.stringify(fieldSource.validationSource)}`);
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
        throw new Error(`Unknown data type ${fieldSource}=${fieldSource.fieldType} for field ${r.name}.${attributeName}`);
        // return undefined;
        // throw new Error('Unknown data type for field ' + r.name + '.' + attributeName);
    }
  };

  function createAttributes(entity: erm.Entity) {
    const adapterArr = rdbadapter.adapter2array(entity.adapter);
    const relations = adapterArr.map( rn => dbs.relations[rn.relationName] );

    relations.forEach( r => {
      if (!r || !r.primaryKey) return;

      const atRelation = atrelations[r.name];

      Object.entries(r.relationFields).forEach( ([fn, rf]) => {
        if (r.primaryKey!.fields.find( f => f === fn )) return;

        if (fn === 'LB' || fn === 'RB') return;

        if (entity.hasAttribute(fn)) return;

        if (!rdbadapter.hasField(entity.adapter, r.name, fn)
          && !rdbadapter.systemFields.find( sf => sf === fn )
          && !rdbadapter.isUserDefined(fn))
        {
          return;
        }

        if (adapterArr[0].selector && adapterArr[0].selector!.field === fn) {
          return;
        }

        const atRelationField = atRelation ? atRelation.relationFields[fn] : undefined;

        if (atRelationField && atRelationField.crossTable) return;

        const attr = createAttribute(
          r, rf, atRelationField,
          entity.hasAttribute(fn) ? `${r.name}.${fn}` : fn,
          relations.length > 1 ? {relation: r.name, field: fn} : undefined
        );

        if (attr) {
          entity.add(attr);
        }
      });

      Object.entries(r.unique).forEach( uq => {
        entity.addUnique(uq[1].fields.map( f => entity.attribute(f) ));
      });
    });
  }

  Object.entries(erModel.entities).forEach( ([name, entity]) => createAttributes(entity) );

  /**
   * Looking for cross-tables and construct set attributes.
   *
   * 1. Cross tables are those whose PK consists of minimum 2 fields.
   * 2. First field of cross table PK must be a FK referencing owner table.
   * 3. Second field of cross table PK must be a FK referencing reference table.
   * 4. Owner in this context is an Entity(s) a Set attribute belongs to.
   * 5. Reference in this context is an Entity(s) a Set attribute contains objects of which type.
   */
  Object.entries(dbs.relations).forEach( ([crossName, crossRelation]) => {
    if (crossRelation.primaryKey && crossRelation.primaryKey.fields.length >= 2) {
      const fkOwner = Object.entries(crossRelation.foreignKeys).find(
        ([n, f]) => f.fields.length === 1 && f.fields[0] === crossRelation.primaryKey!.fields[0]
      );

      if (!fkOwner) return;

      const fkReference = Object.entries(crossRelation.foreignKeys).find(
        ([n, f]) => f.fields.length === 1 && f.fields[0] === crossRelation.primaryKey!.fields[1]
      );

      if (!fkReference) return;

      const relOwner = dbs.relationByUqConstraint(fkOwner[1].constNameUq);
      const atRelOwner = atrelations[relOwner.name];

      if (!atRelOwner) return;

      let entitiesOwner: erm.Entity[];

      const crossRelationAdapter = crossRelationsAdapters[crossName];

      if (crossRelationAdapter) {
        entitiesOwner = findEntities(crossRelationAdapter.owner, crossRelationAdapter.selector ?
          [crossRelationAdapter.selector] : undefined);
      } else {
        entitiesOwner = findEntities(relOwner.name);
      }

      if (!entitiesOwner.length) {
        console.log(`No entities found for relation ${relOwner.name}`);
        return;
        // throw new Error(`No entities found for relation ${relOwner.name}`);
      }

      const relReference = dbs.relationByUqConstraint(fkReference[1].constNameUq);

      let cond: rdbadapter.EntitySelector[] | undefined;
      const atSetField = Object.entries(atRelOwner.relationFields).find(
        rf => rf[1].crossTable === crossName
      );
      const atSetFieldSource = atSetField ? atfields[atSetField[1].fieldSource] : undefined;
      if (atSetFieldSource && atSetFieldSource.setTable === relReference.name && atSetFieldSource.setCondition) {
        cond = rdbadapter.condition2Selectors(atSetFieldSource.setCondition);
      }

      const referenceEntities = findEntities(relReference.name, cond);

      if (!referenceEntities.length) {
        console.log(`No entities found for relation ${relReference.name}`);
        return;
        // throw new Error(`No entities found for relation ${relReference.name}`);
      }

      const setField = atSetField ? relOwner.relationFields[atSetField[0]] : undefined;
      const setFieldSource = setField ? dbs.fields[setField.fieldSource] : undefined;
      const atCrossRelation = atrelations[crossName];

      entitiesOwner.forEach( e => {
        if (!Object.entries(e.attributes).find( ([attrName, attr]) =>
          (attr instanceof erm.SetAttribute) && !!attr.adapter && attr.adapter.crossRelation === crossName ))
        {
          const setAttr = new erm.SetAttribute(
            atSetField ? atSetField[0] : crossName,
            atSetField ? atSetField[1].lName : (atCrossRelation ? atCrossRelation.lName : {en: {name: crossName}}),
            (!!setField && setField.notNull) || (!!setFieldSource && setFieldSource.notNull),
            referenceEntities,
            (setFieldSource && setFieldSource.fieldType === FieldType.VARCHAR) ? setFieldSource.fieldLength : 0,
            {
              crossRelation: crossName
            }
          );

          Object.entries(crossRelation.relationFields).forEach( ([addName, addField]) => {
            if (!crossRelation.primaryKey!.fields.find( f => f === addName )) {
              setAttr.add(
                createAttribute(
                  crossRelation,
                  addField,
                  atCrossRelation ? atCrossRelation.relationFields[addName] : undefined,
                  addName,
                  undefined
                )
              );
            }
          });

          e.add(setAttr);
        }
      })
    }
  });

  return erModel;
}