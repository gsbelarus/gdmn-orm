import { DBStructure, IRefConstraints, FKConstraint } from 'gdmn-db';
import * as erm from './ermodel';

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