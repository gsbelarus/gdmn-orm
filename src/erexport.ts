import { DBStructure, IRefConstraints } from 'gdmn-db';
import { ERModel, Entity } from './ermodel';

export function erExport(dbs: DBStructure, erModel: ERModel) {

  const fieldRef = (fieldName: string, fk: IRefConstraints) => {
    for (const cName in fk) {
      if (fk[cName].fields.find( f => f === fieldName )) {
        return true;
      }
    }
    return false;
  };

  for (const relationName in dbs.relations) {
    const r = dbs.relations[relationName];

    if (r.primaryKey
      && r.primaryKey.fields.length === 1
      && r.primaryKey.fields[0] === 'ID'
      && !fieldRef('ID', r.foreignKeys))
    {
      erModel.add(new Entity(undefined, relationName, relationName));
    }
  };

  return erModel;
}