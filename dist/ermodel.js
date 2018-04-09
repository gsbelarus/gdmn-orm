"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Attribute {
    constructor(name, lName) {
        this.name = name;
        this.lName = lName;
    }
}
exports.Attribute = Attribute;
class Field extends Attribute {
    constructor() {
        super(...arguments);
        this._required = false;
        this._position = 0;
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
    }
}
exports.Field = Field;
class Constraint extends Attribute {
    constructor() {
        super(...arguments);
        this._fields = [];
    }
    get fields() {
        return this._fields;
    }
    field(name) {
        const found = this._fields.find(f => f.name === name);
        if (!found) {
            throw new Error(`Unknown field ${name}`);
        }
        return found;
    }
    add(field) {
        if (this._fields.find(f => f.name === field.name)) {
            throw new Error(`Field ${field.name} already exists`);
        }
        return this.fields.push(field);
    }
}
exports.Constraint = Constraint;
class PrimaryKey extends Constraint {
}
exports.PrimaryKey = PrimaryKey;
class ForeignKey extends Constraint {
}
exports.ForeignKey = ForeignKey;
class UniqueKey extends Constraint {
}
exports.UniqueKey = UniqueKey;
class StringField extends Field {
}
exports.StringField = StringField;
class NumericField extends Field {
}
exports.NumericField = NumericField;
class IntegerField extends NumericField {
}
exports.IntegerField = IntegerField;
class SetAttribute extends Attribute {
}
exports.SetAttribute = SetAttribute;
class WeakAtribute extends Attribute {
}
exports.WeakAtribute = WeakAtribute;
class Entity {
    constructor(parent, name, relName, isAbstract, lName) {
        this._attributes = {};
        this.parent = parent;
        this.name = name;
        this.relName = relName;
        this.lName = lName;
        this.isAbstract = isAbstract;
    }
    get attributes() {
        return this._attributes;
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
}
exports.Entity = Entity;
class ERModel {
    constructor() {
        this._entities = {};
    }
    get entities() {
        return this._entities;
    }
    entity(name) {
        const found = this._entities[name];
        if (!found) {
            throw new Error(`Unknown entity ${name}`);
        }
        return found;
    }
    add(entity) {
        if (this._entities[entity.name]) {
            throw new Error(`Entity ${entity.name} already exists`);
        }
        return this._entities[entity.name] = entity;
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=ermodel.js.map