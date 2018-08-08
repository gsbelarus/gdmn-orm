"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sequence {
    constructor(options) {
        this._name = options.name;
        this._adapter = options.adapter;
    }
    get name() {
        return this._name;
    }
    get adapter() {
        return this._adapter;
    }
}
exports.Sequence = Sequence;
//# sourceMappingURL=Sequence.js.map