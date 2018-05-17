"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function loadERModel(serialized) {
    const erModel = new ermodel_1.ERModel();
    serialized.entities.forEach(e => {
    });
    return erModel;
}
//# sourceMappingURL=serialize.js.map