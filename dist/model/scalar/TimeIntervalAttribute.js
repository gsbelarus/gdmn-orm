"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class TimeIntervalAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super(options);
    }
    static isType(type) {
        return type instanceof TimeIntervalAttribute;
    }
}
exports.TimeIntervalAttribute = TimeIntervalAttribute;
//# sourceMappingURL=TimeIntervalAttribute.js.map