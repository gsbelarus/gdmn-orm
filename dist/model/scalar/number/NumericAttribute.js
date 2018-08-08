"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumberAttribute_1 = require("./NumberAttribute");
class NumericAttribute extends NumberAttribute_1.NumberAttribute {
    constructor(options) {
        super(options);
        this._precision = options.precision;
        this._scale = options.scale;
    }
    get precision() {
        return this._precision;
    }
    get scale() {
        return this._scale;
    }
    static isType(type) {
        return type instanceof NumericAttribute;
    }
    inspectDataType() {
        return `${super.inspectDataType()}(${this._precision}, ${Math.abs(this._scale)})`;
    }
    serialize() {
        return {
            ...super.serialize(),
            precision: this._precision,
            scale: this._scale
        };
    }
}
exports.NumericAttribute = NumericAttribute;
//# sourceMappingURL=NumericAttribute.js.map