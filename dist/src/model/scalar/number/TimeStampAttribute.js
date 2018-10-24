"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class TimeStampAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof TimeStampAttribute;
    }
    serialize() {
        return super.serialize();
    }
}
exports.TimeStampAttribute = TimeStampAttribute;
//# sourceMappingURL=TimeStampAttribute.js.map