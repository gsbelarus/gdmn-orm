"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class DateAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof DateAttribute;
    }
    serialize() {
        return super.serialize();
    }
}
exports.DateAttribute = DateAttribute;
//# sourceMappingURL=DateAttribute.js.map