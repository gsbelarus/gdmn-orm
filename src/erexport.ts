import { DBStructure, IRefConstraints, FKConstraint } from 'gdmn-db';
import { ERModel, Entity } from './ermodel';

function isFieldRef(fieldName: string, fk: IRefConstraints) {
  for (const cName in fk) {
    if (fk[cName].fields.find( f => f === fieldName )) {
      return true;
    }
  }
  return false;
};

export function erExport(dbs: DBStructure, erModel: ERModel) {

  function createEntity(relation) {
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

  return erModel;
}