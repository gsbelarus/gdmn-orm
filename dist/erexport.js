"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function erExport(dbs, erModel) {
    for (const r in dbs.relations) {
        const relation = dbs.relations[r];
        erModel.add(new ermodel_1.Entity(undefined, relation.name, relation.name));
    }
    return erModel;
}
exports.erExport = erExport;
//# sourceMappingURL=erexport.js.map