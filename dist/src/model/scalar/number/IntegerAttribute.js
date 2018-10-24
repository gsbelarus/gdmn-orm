"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class IntegerAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof IntegerAttribute;
    }
}
exports.IntegerAttribute = IntegerAttribute;
//# sourceMappingURL=IntegerAttribute.js.map