import { DBStructure, IRefConstraints, FKConstraint } from 'gdmn-db';
import * as erm from './ermodel';
import { MAX_32BIT_INT } from './rdbadapter';

function isFieldRef(fieldName: string, fk: IRefConstraints) {
  for (const cName in fk) {
    if (fk[cName].fields.find( f => f === fieldName )) {
      return true;
    }
  }
  return false;
};

export function erExport(dbs: DBStructure, erModel: erm.ERModel) {

  /*
  function createEntity(relation) {
    console.log(relation.name);

    if (erModel.entities[relation.name]) {
      return erModel.entities[relation.name];
    }

    const pkFields = relation.primaryKey.fields.join();

    for (const fkName in relation.foreignKeys) {
      const fk = relation.foreignKeys[fkName];
      if (fk.fields.join() === pkFields) {
        return erModel.add(new Entity(createEntity(dbs.relationByUqConstraint(fk.constNameUq)), relation.name, relation.name));
      }
    }

    return erModel.add(new Entity(undefined, relation.name, relation.name));
  };

  dbs.forEachRelation( r => {
    if (!r.primaryKey) return;
    createEntity(r);
  });
  */

  /**
   * Если имя генератора совпадает с именем объекта в БД, то адаптер можем не указывать.
   */

  const GDGUnique = erModel.addSequence(new erm.Sequence('GD_G_UNIQUE'));
  const GDGOffset = erModel.addSequence(new erm.Sequence('Offset', { sequence: 'GD_G_OFFSET' }));

  /**
   * Простейший случай таблицы. Никаких ссылок.
   * -- Если имя Entity совпадает с именем таблицы и ее структура PLAIN, то можем не указывать адаптер.
   * -- Первое добавляемое поле в Entity автоматом становится PK.
   * -- Если имя атрибута совпадает с именем поля, то в адаптере имя поля можно не указывать.
   */

  const Holiday = erModel.add(
    new erm.Entity(undefined, 'WG_HOLIDAY', {ru: {name: 'Государственный праздник'}}, false)
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
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP')
  );
  Holiday.add(
    new erm.BooleanAttribute('DISABLED', {ru: {name: 'Отключено'}}, true, false)
  );

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
        relation: 'GD_CONTACT',
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
    new erm.TimeStampAttribute('EDITIONDATE', {ru: {name: 'Изменено'}}, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP')
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
          relation: 'GD_CONTACT',
          structure: 'LBRB',
          selector: {
            field: 'CONTACTTYPE',
            value: 3
          }
        },
        {
          relation: 'GD_COMPANY'
        },
        {
          relation: 'GD_COMPANYCODE',
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
   * Все поля компании являются и полями банка и не нуждаются в повторном
   * определении.
   */
  const Bank = erModel.add(new erm.Entity(Company, 'Bank', {ru: {name: 'Банк'}},
    false,
    {
      relation: [
        {
          relation: 'GD_CONTACT',
          structure: 'LBRB',
          selector: {
            field: 'CONTACTTYPE',
            value: 4
          }
        },
        {
          relation: 'GD_COMPANY'
        },
        {
          relation: 'GD_BANK'
        },
        {
          relation: 'GD_COMPANYCODE',
          weak: true
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

  /*

  const Group = erModel.add(new erm.Entity(undefined, 'Group', {ru: {name: 'Группа'}},
    false,
    {
      relation: 'GD_CONTACT',
      structure: 'LBRB',
      selector: {
        field: 'CONTACTTYPE',
        value: 1
      }
    }
  ));
  Group.add(new erm.IntegerAttribute('ID', {ru: {name: 'Идентификатор'}}, true));
  Group.add(new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder]));
  Group.add(new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true));
  Group.add(new erm.SetAttribute('CONTACTLIST', {ru: {name: 'Контакты'}}, false, []));

  */

  return erModel;
}