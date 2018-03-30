import { DBStructure } from 'gdmn-db';
import { ERModel, Entity } from './ermodel';

export function erExport(dbs: DBStructure) {

  const erModel = new ERModel();

  for (const r in dbs.relations) {
    const relation = dbs.relations[r];
    erModel.add(new Entity(undefined, relation.name, relation.name));
  }

  return erModel;
}