"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class EnumAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
        this._values = options.values;
        this._defaultValue = options.defaultValue;
    }
    get values() {
        return this._values;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    static isType(type) {
        return type instanceof EnumAttribute;
    }
    inspectDataType() {
        return super.inspectDataType() + " " + JSON.stringify(this._values);
    }
    serialize() {
        return Object.assign({}, super.serialize(), { values: this._values, defaultValue: this._defaultValue });
    }
}
exports.EnumAttribute = EnumAttribute;
//# sourceMappingURL=EnumAttribute.js.map