"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class FloatAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof FloatAttribute;
    }
}
exports.FloatAttribute = FloatAttribute;
//# sourceMappingURL=FloatAttribute.js.map