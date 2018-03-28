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
    constructor(name, lName, fieldName, notNull) {
        super(name, lName);
        this.fieldName = fieldName;
        this.notNull = notNull;
    }
}
exports.Field = Field;
class Constraint extends Attribute {
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
class SetAttribute extends Attribute {
}
exports.SetAttribute = SetAttribute;
class WeakAtribute extends Attribute {
}
exports.WeakAtribute = WeakAtribute;
class Entity {
    constructor(parent, name, relName, lName) {
        this.parent = parent;
        this.name = name;
        this.relName = relName;
        this.lName = lName;
        this.attributes = {};
    }
}
exports.Entity = Entity;
class ERModel {
    constructor() {
        this.entities = {};
    }
    entity(name) {
        return this.entities[name];
    }
    add(name, relName, lName) {
        const entity = new Entity(undefined, name, relName, lName);
        this.entities[name] = entity;
        return entity;
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=index.js.map