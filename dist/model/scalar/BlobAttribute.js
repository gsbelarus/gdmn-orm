"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class BlobAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof BlobAttribute;
    }
}
exports.BlobAttribute = BlobAttribute;
//# sourceMappingURL=BlobAttribute.js.map