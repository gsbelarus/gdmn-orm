"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attribute_1 = require("../Attribute");
class EntityAttribute extends Attribute_1.Attribute {
    constructor(options) {
        super(options);
        this._entities = options.entities;
    }
    get entity() {
        return this._entities;
    }
    static isType(type) {
        return type instanceof EntityAttribute;
    }
    serialize() {
        return {
            ...super.serialize(),
            references: this._entities.map(ent => ent.name)
        };
    }
    inspectDataType() {
        return super.inspectDataType() + ' [' + this._entities.reduce((p, e, idx) => p + (idx ? ', ' : '') + e.name, '') + ']';
    }
}
exports.EntityAttribute = EntityAttribute;
//# sourceMappingURL=EntityAttribute.js.map