"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function erExport(dbs, erModel) {
    const fieldRef = (fieldName, fk) => {
        for (const cName in fk) {
            if (fk[cName].fields.find(f => f === fieldName)) {
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
            && !fieldRef('ID', r.foreignKeys)) {
            erModel.add(new ermodel_1.Entity(undefined, relationName, relationName));
        }
    }
    ;
    return erModel;
}
exports.erExport = erExport;
//# sourceMappingURL=erexport.js.map