"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function isFieldRef(fieldName, fk) {
    for (const cName in fk) {
        if (fk[cName].fields.find(f => f === fieldName)) {
            return true;
        }
    }
    return false;
}
;
function erExport(dbs, erModel) {
    function createEntity(relation) {
        console.log(relation.name);
        if (erModel.entities[relation.name]) {
            return erModel.entities[relation.name];
        }
        const pkFields = relation.primaryKey.fields.join();
        for (const fkName in relation.foreignKeys) {
            const fk = relation.foreignKeys[fkName];
            if (fk.fields.join() === pkFields) {
                return erModel.add(new ermodel_1.Entity(createEntity(dbs.relationByUqConstraint(fk.constNameUq)), relation.name, relation.name));
            }
        }
        return erModel.add(new ermodel_1.Entity(undefined, relation.name, relation.name));
    }
    ;
    dbs.forEachRelation(r => {
        if (!r.primaryKey)
            return;
        createEntity(r);
    });
    return erModel;
}
exports.erExport = erExport;
//# sourceMappingURL=erexport.js.map