"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attribute_1 = require("../Attribute");
class ScalarAttribute extends Attribute_1.Attribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof ScalarAttribute;
    }
}
exports.ScalarAttribute = ScalarAttribute;
//# sourceMappingURL=ScalarAttribute.js.map