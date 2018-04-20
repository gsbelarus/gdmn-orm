import { DBStructure, IRefConstraints, FKConstraint, Relation, FieldType, ATransaction } from 'gdmn-db';
import * as erm from '../ermodel';
import * as rdbadapter from '../rdbadapter';
import { LName } from '../types';
import { load } from './atdata';

export async function erExport(dbs: DBStructure, transaction: ATransaction, erModel: erm.ERModel): Promise<erm.ERModel> {

  const { atfields, atrelations } = await load(transaction);

  /**
   * Если имя генератора совпадает с именем объекта в БД, то адаптер можем не указывать.
   */

  const GDGUnique = erModel.addSequence(new erm.Sequence('GD_G_UNIQUE'));
  const GDGOffset = erModel.addSequence(new erm.Sequence('Offset', { sequence: 'GD_G_OFFSET' }));

  /**
   * Папка из справочника контактов.
   * Основывается на таблице GD_CONTACT, но использует только несколько полей из нее.
   * Записи имеют признак CONTACTTYPE = 0.
   * Имеет древовидную структуру.
   */
  const Folder = erModel.add(new erm.Entity(undefined, 'Folder', {ru: {name: 'Папка'}},
    false,
    {
      relation: {
        relationName: 'GD_CONTACT',
        structure: 'LBRB',
        selector: {
          field: 'CONTACTTYPE',
          value: 0
        }
      }
    }
  ));
  Folder.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Folder.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  Folder.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  Folder.add(
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true,
      new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
    )
  );
  Folder.add(
    new erm.BooleanAttribute('DISABLED', {ru: {name: 'Отключено'}}, true, false)
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
  const Company = erModel.add(new erm.Entity(undefined, 'Company', {ru: {name: 'Организация'}},
    false,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          structure: 'LBRB',
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
    }
  ));
  Company.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Company.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  Company.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Краткое наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  Company.add(
    new erm.StringAttribute('PHONE', {ru: {name: 'Номер телефона'}}, true, undefined, 40, undefined, true, /^[\d+-,]{7,40}$/)
  );
  Company.add(
    new erm.StringAttribute('FULLNAME', {ru: {name: 'Полное наименование'}}, true, undefined, 180, undefined, true, undefined,
    {
      relation: 'GD_COMPANY'
    }
  ));
  Company.add(
    new erm.StringAttribute('TAXID', {ru: {name: 'УНП'}}, false, undefined, 9, undefined, true, /^[\d]{9}$/,
    {
      relation: 'GD_COMPANYCODE'
    }
  ));

  /**
   * Банк является частным случаем компании (наследуется от компании).
   * В адаптере мы указываем только те таблицы (значения), которые
   * отличаются от родителя. Результирующий адаптер получается слиянием
   * родительского адаптера и текущего.
   * Все атрибуты компании являются и атрибутами банка и не нуждаются
   * в повторном определении, за тем исключением, если мы хотим что-то
   * поменять в параметрах атрибута.
   */
  const Bank = erModel.add(new erm.Entity(Company, 'Bank', {ru: {name: 'Банк'}},
    false,
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
          relationName: 'GD_BANK'
        }
      ],
      refresh: true
    }
  ));
  Bank.add(
    new erm.StringAttribute('BANKCODE', {ru: {name: 'Код банка'}}, true, undefined, 20, undefined, true, undefined,
    {
      relation: 'GD_BANK'
    }
  ));

  /**
   * Подразделение организации может входить (через поле Parent) в
   * организацию (компания, банк) или в другое подразделение.
   */
  const Department = erModel.add(new erm.Entity(undefined, 'Department', {ru: {name: 'Подразделение'}},
    false,
    {
      relation: {
        relationName: 'GD_CONTACT',
        structure: 'LBRB',
        selector: {
          field: 'CONTACTTYPE',
          value: 4
        }
      }
    }
  ));
  Department.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Department.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в организацию (подразделение)'}}, [Company, Department])
  );
  Department.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  Department.add(
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true,
      new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
    )
  );
  Department.add(
    new erm.BooleanAttribute('DISABLED', {ru: {name: 'Отключено'}}, true, false)
  );

  /**
   * Физическое лицо хранится в двух таблицах GD_CONTACT - GD_PEOPLE.
   */
  const Person = erModel.add(new erm.Entity(undefined, 'Person', {ru: {name: 'Физическое лицо'}},
    false,
    {
      relation: [
        {
          relationName: 'GD_CONTACT',
          structure: 'LBRB',
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
    }
  ));
  Person.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Person.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  Person.add(
    new erm.StringAttribute('NAME', {ru: {name: 'ФИО'}}, true, undefined, 60, undefined, true, undefined)
  );
  Person.add(
    new erm.StringAttribute('PHONE', {ru: {name: 'Номер телефона'}}, true, undefined, 40, undefined, true, /^[\d+-,]{7,40}$/)
  );
  Person.add(
    new erm.StringAttribute('SURNAME', {ru: {name: 'Фамилия'}}, true, undefined, 20, undefined, true, undefined,
    {
      relation: 'GD_PEOPLE'
    }
  ));

  /**
   * Сотрудник, частный случай физического лица.
   * Добавляется таблица GD_EMPLOYEE.
   */
  const Employee = erModel.add(new erm.Entity(Person, 'Employee', {ru: {name: 'Физическое лицо'}},
    false,
    {
      relation:
        {
          relationName: 'GD_EMPLOYEE'
        }
    }
  ));
  Employee.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Организация или подразделение'}}, [Company, Department])
  );


  /**
   * Группа контактов.
   * CONTACTLIST -- множество, которое хранится в кросс-таблице.
   */
  const Group = erModel.add(new erm.Entity(undefined, 'Group', {ru: {name: 'Группа'}},
    false,
    {
      relation:
        {
          relationName: 'GD_CONTACT',
          structure: 'LBRB',
          selector: {
            field: 'CONTACTTYPE',
            value: 1
          }
        }
    }
  ));
  Group.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Group.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder])
  );
  Group.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  const ContactList =
    Group.add(
      new erm.SetAttribute('CONTACTLIST', {ru: {name: 'Контакты'}}, false, [Company, Person],
        {
          crossRelation: 'GD_CONTACTLIST'
        }
      )
    ) as erm.SetAttribute;
  ContactList.add(
    new erm.IntegerAttribute('RESERVED', {ru: {name: 'Зарезервировано'}}, false, undefined, undefined, undefined)
  );

  /**
   * Административно-территориальная единица.
   * Тут исключительно для иллюстрации типа данных Перечисление.
   */
  const Place = erModel.add(new erm.Entity(undefined, 'Place', {ru: {name: 'Папка'}},
    false,
    {
      relation: {
        relationName: 'GD_PLACE',
        structure: 'LBRB'
      }
    }
  ));
  Place.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Place.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в'}}, [Place])
  );
  Place.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  Place.add(
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
  );
  Place.add(
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true,
      new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
    )
  );

  /**
   * Документ.
   */
  const Document = erModel.add(new erm.Entity(undefined, 'Document', {ru: {name: 'Документ'}},
    true,
    {
      relation: {
        relationName: 'GD_DOCUMENT',
        structure: 'TREE'
      }
    }
  ));
  Document.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Document.add(
    new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в'}}, [Document])
  );
  Document.add(
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true,
      new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
    )
  );

  function default2Int(defaultValue: string | null): number | undefined {
    const num = Number(defaultValue);
    return (num || num === 0) && Number.isInteger(num) ? num : undefined;
  }

  function default2Number(defaultValue: string | null): number | undefined {
    const num = Number(defaultValue);
    return (num || num === 0) ? num : undefined;
  }

  function default2Date(defaultValue: string | null): Date | erm.ContextVariables | undefined {
    if (defaultValue === 'CURRENT_TIMESTAMP(0)') return 'CURRENT_TIMESTAMP(0)';
    if (defaultValue === 'CURRENT_TIMESTAMP') return 'CURRENT_TIMESTAMP';
    if (defaultValue === 'CURRENT_TIME') return 'CURRENT_TIME';
    if (defaultValue === 'CURRENT_DATE') return 'CURRENT_DATE';
    if (defaultValue && Date.parse(defaultValue)) return new Date(defaultValue);
    return undefined;
  }

  function createEntity(relation: Relation): erm.Entity {

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

    return erModel.add(new erm.Entity(
      parent,
      relation.name,
      atrelations[relation.name].lName,
      false,
      {
        relation: {
          relationName: relation.name
        }
      }
    ));
  };

  /**
   * Простейший случай таблицы. Никаких ссылок.
   * -- Если имя Entity совпадает с именем таблицы и ее структура PLAIN, то можем не указывать адаптер.
   * -- Первое добавляемое поле в Entity автоматом становится PK.
   * -- Если имя атрибута совпадает с именем поля, то в адаптере имя поля можно не указывать.
   */

  const Holiday = erModel.add(
    new erm.Entity(undefined, 'WG_HOLIDAY', {ru: {name: 'Государственный праздник'}}, false,
      {
        relation:
          {
            relationName: 'WG_HOLIDAY'
          }
      }
    )
  );
  Holiday.add(
    new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
  );
  Holiday.addUnique([
    Holiday.add(
      new erm.DateAttribute('HOLIDAYDATE', {ru: {name: 'Дата праздника'}}, true, new Date('2000-01-01'), new Date('2100-12-31'), undefined)
    )
  ]);
  Holiday.add(
    new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true, undefined, 60, undefined, true, undefined)
  );
  Holiday.add(
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true,
      new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
    )
  );
  Holiday.add(
    new erm.BooleanAttribute('DISABLED', {ru: {name: 'Отключено'}}, true, false)
  );

  /**
   * @todo Parse fields CHECK constraint and extract min and max allowed values.
   */

  dbs.forEachRelation( r => {
    if (r.primaryKey && r.primaryKey.fields.join() === 'ID' && /^USR\$.+$/.test(r.name)) {
      const entity = createEntity(r);

      entity.add(
        new erm.SequenceAttribute('ID', {ru: {name: 'Идентификатор'}}, GDGUnique)
      );

      Object.entries(r.relationFields).forEach( rf => {
        const fieldSource = dbs.fields[rf[1].fieldSource];
        const lName: LName = {en: {name: rf[0]}};
        const required: boolean = rf[1].notNull || fieldSource.notNull;
        const defaultValue: string | null = rf[1].defaultValue || fieldSource.defaultValue;
        const adapter: rdbadapter.Attribute2FieldMap = {relation: r.name};

        const attr = ( () => {
          switch (rf[1].fieldSource) {
            case 'DEDITIONDATE':
              return new erm.TimeStampAttribute(rf[0], {ru: {name: 'Изменено'}}, true,
                new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
              );
            case 'DCREATIONDATE':
              return new erm.TimeStampAttribute(rf[0], {ru: {name: 'Создано'}}, true,
                new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
              );
            case 'DDOCUMENTDATE':
              return new erm.TimeStampAttribute(rf[0], {ru: {name: 'Дата документа'}}, true,
                new Date('1900-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'
              );
            case 'DQUANTITY': return new erm.NumericAttribute(rf[0], lName, false, 15, 4, undefined, undefined, undefined, adapter);
            case 'DLAT': return new erm.NumericAttribute(rf[0], lName, false, 10, 8, -90, +90, undefined, adapter);
            case 'DLON': return new erm.NumericAttribute(rf[0], lName, false, 11, 8, -180, +180, undefined, adapter);
            case 'DCURRENCY': return new erm.NumericAttribute(rf[0], lName, false, 15, 4, undefined, undefined, undefined, adapter);
            case 'DPOSITIVE': return new erm.NumericAttribute(rf[0], lName, false, 15, 8, 0, undefined, undefined, adapter);
            case 'DPERCENT': return new erm.NumericAttribute(rf[0], lName, false, 7, 4, undefined, undefined, undefined, adapter);
            case 'DTAX': return new erm.NumericAttribute(rf[0], lName, false, 7, 4, 0, 99, undefined, adapter);
            case 'DDECDIGITS': return new erm.IntegerAttribute(rf[0], lName, false, 0, 16, undefined, adapter);
            case 'DACCOUNTTYPE': return new erm.EnumAttribute(rf[0], lName, false, [{value: 'D'}, {value: 'K'}], undefined, adapter);
            case 'DGENDER': return new erm.EnumAttribute(rf[0], lName, false, [{value: 'M'}, {value: 'F'}, {value: 'N'}], undefined, adapter);
            case 'DTEXTALIGNMENT': return new erm.EnumAttribute(rf[0], lName, false,
              [{value: 'L'}, {value: 'R'}, {value: 'C'}, {value: 'J'}], 'L', adapter);
            case 'DSECURITY': return new erm.IntegerAttribute(rf[0], lName, true, undefined, undefined, -1, adapter);
            case 'DDISABLED': return new erm.BooleanAttribute(rf[0], lName, false, false, adapter);
            case 'DBOOLEAN': return new erm.BooleanAttribute(rf[0], lName, false, false, adapter);
            case 'DBOOLEAN_NOTNULL': return new erm.BooleanAttribute(rf[0], lName, true, false, adapter);
            // следующие домены надо проверить, возможно уже нигде и не используются
            case 'DTYPETRANSPORT': return new erm.EnumAttribute(rf[0], lName, false,
              [{value: 'C'}, {value: 'S'}, {value: 'R'}, {value: 'O'}, {value: 'W'}], undefined, adapter);
            case 'DGOLDQUANTITY': return new erm.NumericAttribute(rf[0], lName, false, 15, 8, undefined, undefined, undefined, adapter);
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

            return new erm.NumericAttribute(rf[0], lName, required,
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
                f => !!f[1].fields.find( fld => fld === rf[0] )
              );

              if (fk && fk[1].fields.length === 1) {
                return new erm.EntityAttribute(rf[0], lName, required,
                  [createEntity(dbs.relationByUqConstraint(fk[1].constNameUq))],
                  adapter);
              } else {
                return new erm.IntegerAttribute(rf[0], lName, required,
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
                  return new erm.EnumAttribute(rf[0], lName, required, enumValues, undefined, adapter);
                } else {
                  console.log(JSON.stringify(fieldSource.validationSource));
                }
              }

              return new erm.StringAttribute(rf[0], lName, required, undefined,
                fieldSource.fieldLength, undefined, true, undefined);
            }

            case FieldType.TIMESTAMP:
              return new erm.TimeStampAttribute(rf[0], lName, required, undefined, undefined, default2Date(defaultValue));

            case FieldType.DATE:
              return new erm.DateAttribute(rf[0], lName, required, undefined, undefined, default2Date(defaultValue));

            case FieldType.TIME:
              return new erm.TimeAttribute(rf[0], lName, required, undefined, undefined, default2Date(defaultValue));

            case FieldType.FLOAT:
            case FieldType.DOUBLE:
              return new erm.FloatAttribute(rf[0], lName, required,
                  undefined, undefined,
                  default2Number(defaultValue),
                  adapter);

            case FieldType.SMALL_INTEGER:
              return new erm.IntegerAttribute(rf[0], lName, required,
                  rdbadapter.MIN_16BIT_INT, rdbadapter.MAX_16BIT_INT,
                  default2Int(defaultValue),
                  adapter);

            case FieldType.BIG_INTEGER:
              return new erm.IntegerAttribute(rf[0], lName, required,
                rdbadapter.MIN_64BIT_INT, rdbadapter.MAX_64BIT_INT,
                default2Int(defaultValue),
                adapter);

            case FieldType.BLOB:
              if (fieldSource.fieldSubType === 1) {
                return new erm.StringAttribute(rf[0], lName, required, undefined,
                  undefined, undefined, false, undefined);
              }

            default:
              console.log(`Unknown data type ${fieldSource.fieldType} for field ${r.name}.${rf[0]}`);
              return undefined;
              // throw new Error('Unknown data type for field ' + r.name + '.' + rf[0]);
          }
        })();
        if (attr && !entity.attributes[attr.name]) entity.add(attr);
      });
    }
  });

  return erModel;
}