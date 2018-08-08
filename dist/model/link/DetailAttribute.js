"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityAttribute_1 = require("./EntityAttribute");
class DetailAttribute extends EntityAttribute_1.EntityAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof DetailAttribute;
    }
}
exports.DetailAttribute = DetailAttribute;
//# sourceMappingURL=DetailAttribute.js.map