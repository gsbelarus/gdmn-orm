"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class BooleanAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
        this._defaultValue = options.defaultValue || false;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    static isType(type) {
        return type instanceof BooleanAttribute;
    }
    serialize() {
        return Object.assign({}, super.serialize(), { defaultValue: this._defaultValue });
    }
}
exports.BooleanAttribute = BooleanAttribute;
//# sourceMappingURL=BooleanAttribute.js.map