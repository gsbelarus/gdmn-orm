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
        this._notNull = false;
        this._position = 0;
    }
    get notNull() {
        return this._notNull;
    }
    set notNull(value) {
        this._notNull = value;
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
    findField(name) {
        return this.fields[name];
    }
    field(name) {
        const found = this.findField(name);
        if (!found) {
            throw new Error(`Unknown field ${name}`);
        }
        return found;
    }
    add(field) {
        if (this.findField(field.name)) {
            throw new Error(`Field ${field.name} already exists`);
        }
        return this.fields[field.name] = field;
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
    constructor(parent, name, relName, lName) {
        this._attributes = {};
        this.parent = parent;
        this.name = name;
        this.relName = relName;
        this.lName = lName;
    }
    findAttribute(name) {
        return this._attributes[name];
    }
    attribute(name) {
        const found = this.findAttribute(name);
        if (!found) {
            throw new Error(`Unknown attribute ${name}`);
        }
        return found;
    }
    add(attribute) {
        if (this.findAttribute(attribute.name)) {
            throw new Error(`Attribute ${attribute.name} already exists`);
        }
        return this._attributes[attribute.name] = attribute;
    }
}
exports.Entity = Entity;
class ERModel {
    constructor() {
        this.entities = {};
    }
    findEntity(name) {
        return this.entities[name];
    }
    entity(name) {
        const found = this.findEntity(name);
        if (!found) {
            throw new Error(`Unknown entity ${name}`);
        }
        return found;
    }
    add(entity) {
        if (this.findEntity(entity.name)) {
            throw new Error(`Entity ${entity.name} already exists`);
        }
        return this.entities[entity.name] = entity;
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=ermodel.js.map