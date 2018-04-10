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
    new erm.Entity(undefined, 'WG_HOLIDAY', {ru: {name: 'Государственный праздник'}}, false, GDGUnique)
  );
  Holiday.add(
    new erm.IntegerAttribute('ID', {ru: {name: 'Идентификатор'}}, true, 1, MAX_32BIT_INT, undefined)
  );
  Holiday.add(
    new erm.DateAttribute('HOLIDAYDATE', {ru: {name: 'Дата праздника'}}, true, '2000-01-01', '2100-12-31', undefined)
  );

  const Folder = erModel.add(new erm.Entity(undefined, 'Folder', {ru: {name: 'Папка'}},
    false,
    {
      relation: 'GD_CONTACT',
      structure: 'LBRB',
      selector: {
        field: 'CONTACTTYPE',
        value: 0
      }
    }
  ));
  Folder.add(new erm.IntegerAttribute('ID', {ru: {name: 'Идентификатор'}}, true));
  Folder.add(new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder]));
  Folder.add(new erm.StringAttribute('NAME', {ru: {name: 'Наименование'}}, true));

  const Company = erModel.add(new erm.Entity(undefined, 'Company', {ru: {name: 'Организация'}},
    false,
    {
      relation: ['GD_CONTACT', 'GD_COMPANY'],
      weakRelation: 'GD_COMPANYCODE',
      structure: 'LBRB'
    }
  ));
  Company.add(new erm.IntegerAttribute('ID', {ru: {name: 'Идентификатор'}}, true));
  Company.add(new erm.ParentAttribute('PARENT', {ru: {name: 'Входит в папку'}}, [Folder]));
  Company.add(new erm.StringAttribute('NAME', {ru: {name: 'Краткое наименование'}}, true));
  Company.add(new erm.StringAttribute('PHONE', {ru: {name: 'Телефон'}}, false));
  Company.add(new erm.StringAttribute('FULLNAME', {ru: {name: 'Полное наименование'}}, true,
    {
      relation: 'GD_COMPANY',
      field: 'FULLNAME'
    }
  ));
  Company.add(new erm.StringAttribute('TAXID', {ru: {name: 'УНП'}}, false,
    {
      relation: 'GD_COMPANYCODE',
      field: 'TAXID'
    }
  ));

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

  return erModel;
}