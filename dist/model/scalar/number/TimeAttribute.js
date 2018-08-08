"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class TimeAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof TimeAttribute;
    }
    serialize() {
        return super.serialize();
    }
}
exports.TimeAttribute = TimeAttribute;
//# sourceMappingURL=TimeAttribute.js.map