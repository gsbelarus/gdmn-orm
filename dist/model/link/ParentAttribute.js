"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityAttribute_1 = require("./EntityAttribute");
class ParentAttribute extends EntityAttribute_1.EntityAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof ParentAttribute;
    }
}
exports.ParentAttribute = ParentAttribute;
//# sourceMappingURL=ParentAttribute.js.map