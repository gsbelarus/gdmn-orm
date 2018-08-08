"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScalarAttribute_1 = require("./ScalarAttribute");
class SequenceAttribute extends ScalarAttribute_1.ScalarAttribute {
    constructor(options) {
        super({ ...options, required: true });
        this._sequence = options.sequence;
    }
    get sequence() {
        return this._sequence;
    }
    static isType(type) {
        return type instanceof SequenceAttribute;
    }
    serialize() {
        return {
            ...super.serialize(),
            sequence: this._sequence.name
        };
    }
}
exports.SequenceAttribute = SequenceAttribute;
//# sourceMappingURL=SequenceAttribute.js.map