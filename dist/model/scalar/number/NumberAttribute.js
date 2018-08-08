"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("../ScalarAttribute");
class NumberAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
        this._minValue = options.minValue;
        this._maxValue = options.maxValue;
        this._defaultValue = options.defaultValue;
    }
    get minValue() {
        return this._minValue;
    }
    get maxValue() {
        return this._maxValue;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    static isType(type) {
        return type instanceof NumberAttribute;
    }
    serialize() {
        return {
            ...super.serialize(),
            minValue: this._minValue,
            maxValue: this._maxValue,
            defaultValue: this._defaultValue
        };
    }
}
exports.NumberAttribute = NumberAttribute;
//# sourceMappingURL=NumberAttribute.js.map