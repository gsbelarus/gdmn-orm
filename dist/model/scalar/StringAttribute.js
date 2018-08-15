"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class StringAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
        this._minLength = options.minLength;
        this._maxLength = options.maxLength;
        this._defaultValue = options.defaultValue;
        this._autoTrim = options.autoTrim || true;
        this._mask = options.mask;
    }
    get minLength() {
        return this._minLength;
    }
    get maxLength() {
        return this._maxLength;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    get mask() {
        return this._mask;
    }
    get autoTrim() {
        return this._autoTrim;
    }
    static isType(type) {
        return type instanceof StringAttribute;
    }
    serialize() {
        return {
            ...super.serialize(),
            minLength: this._minLength,
            maxLength: this._maxLength,
            defaultValue: this._defaultValue,
            mask: this._mask,
            autoTrim: this._autoTrim
        };
    }
    inspectDataType() {
        return super.inspectDataType() + (this._maxLength ? "(" + this._maxLength + ")" : "");
    }
}
exports.StringAttribute = StringAttribute;
//# sourceMappingURL=StringAttribute.js.map