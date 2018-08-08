"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityAttribute_1 = require("./EntityAttribute");
class SetAttribute extends EntityAttribute_1.EntityAttribute {
    constructor(options) {
        super(options);
        this._attributes = {};
        this._presLen = options.presLen || 0;
    }
    get attributes() {
        return this._attributes;
    }
    static isType(type) {
        return type instanceof SetAttribute;
    }
    attribute(name) {
        const found = this._attributes[name];
        if (!found) {
            throw new Error(`Unknown attribute ${name}`);
        }
        return found;
    }
    add(attribute) {
        if (this._attributes[attribute.name]) {
            throw new Error(`Attribute ${attribute.name} already exists`);
        }
        return this._attributes[attribute.name] = attribute;
    }
    serialize() {
        return {
            ...super.serialize(),
            attributes: Object.entries(this._attributes).map(a => a[1].serialize()),
            presLen: this._presLen
        };
    }
    inspect(indent = '    ') {
        const result = super.inspect();
        return [...result,
            ...Object.entries(this._attributes).reduce((p, a) => {
                return [...p, ...a[1].inspect(indent + '  ')];
            }, [])
        ];
    }
}
exports.SetAttribute = SetAttribute;
//# sourceMappingURL=SetAttribute.js.map