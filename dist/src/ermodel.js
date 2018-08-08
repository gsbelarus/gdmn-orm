"use strict";
/**
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_nlp_1 = require("gdmn-nlp");
const rdbadapter_1 = require("./rdbadapter");
class Attribute {
    constructor(name, lName, required, semCategories = [], adapter) {
        this._calculated = false;
        this._name = name;
        this._lName = lName;
        this._required = required;
        this._semCategories = semCategories;
        this._adapter = adapter;
    }
    get adapter() {
        return this._adapter;
    }
    get name() {
        return this._name;
    }
    get lName() {
        return this._lName;
    }
    get required() {
        return this._required;
    }
    get semCategories() {
        return this._semCategories;
    }
    get calculated() {
        return this._calculated;
    }
    serialize() {
        return {
            name: this.name,
            type: this.constructor.name,
            lName: this._lName,
            required: this._required,
            semCategories: gdmn_nlp_1.semCategories2Str(this._semCategories),
            calculated: this._calculated
        };
    }
    inspectDataType() {
        const sn = {
            'EntityAttribute': '->',
            'StringAttribute': 'S',
            'SetAttribute': '<->',
            'ParentAttribute': '-^',
            'SequenceAttribute': 'PK',
            'IntegerAttribute': 'I',
            'NumericAttribute': 'N',
            'FloatAttribute': 'F',
            'BooleanAttribute': 'B',
            'DateAttribute': 'DT',
            'TimeStampAttribute': 'TS',
            'TimeAttribute': 'TM',
            'BlobAttribute': 'BLOB',
            'EnumAttribute': 'E'
        };
        return sn[this.constructor.name] ? sn[this.constructor.name] : this.constructor.name;
    }
    inspect(indent = '    ') {
        const adapter = this.adapter ? ', ' + JSON.stringify(this.adapter) : '';
        const lName = this.lName.ru ? ' - ' + this.lName.ru.name : '';
        const cat = this._semCategories.length ? `, categories: ${gdmn_nlp_1.semCategories2Str(this._semCategories)}` : '';
        return [
            `${indent}${this._name}${this.required ? '*' : ''}${lName}: ${this.inspectDataType()}${cat}${adapter}`
        ];
    }
}
exports.Attribute = Attribute;
class ScalarAttribute extends Attribute {
}
exports.ScalarAttribute = ScalarAttribute;
class StringAttribute extends ScalarAttribute {
    constructor(name, lName, required, minLength, maxLength, defaultValue, autoTrim, mask, semCategories = [], adapter) {
        super(name, lName, required, semCategories, adapter);
        this._autoTrim = true;
        this._minLength = minLength;
        this._maxLength = maxLength;
        this._defaultValue = defaultValue;
        this._autoTrim = autoTrim;
        this._mask = mask;
    }
    get minLength() {
        return this._minLength;
    }
    get maxLength() {
        return this._maxLength;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    get mask() {
        return this._mask;
    }
    get autoTrim() {
        return this._autoTrim;
    }
    serialize() {
        return {
            ...super.serialize(),
            minLength: this._minLength,
            maxLength: this._maxLength,
            defaultValue: this._defaultValue,
            mask: this._mask,
            autoTrim: this._autoTrim
        };
    }
    inspectDataType() {
        return super.inspectDataType() + (this._maxLength ? '(' + this._maxLength + ')' : '');
    }
}
exports.StringAttribute = StringAttribute;
class SequenceAttribute extends ScalarAttribute {
    constructor(name, lName, sequence, semCategories = [], adapter) {
        super(name, lName, true, semCategories, adapter);
        this._sequence = sequence;
    }
    get sequence() {
        return this._sequence;
    }
    serialize() {
        return {
            ...super.serialize(),
            sequence: this._sequence.name
        };
    }
}
exports.SequenceAttribute = SequenceAttribute;
class NumberAttribute extends ScalarAttribute {
    constructor(name, lName, required, minValue, maxValue, defaultValue, semCategories = [], adapter) {
        super(name, lName, required, semCategories, adapter);
        this._minValue = minValue;
        this._maxValue = maxValue;
        this._defaultValue = defaultValue;
    }
    get minValue() {
        return this._minValue;
    }
    get maxValue() {
        return this._maxValue;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    serialize() {
        return {
            ...super.serialize(),
            minValue: this._minValue,
            maxValue: this._maxValue,
            defaultValue: this._defaultValue
        };
    }
}
exports.NumberAttribute = NumberAttribute;
class IntegerAttribute extends NumberAttribute {
}
exports.IntegerAttribute = IntegerAttribute;
class FloatAttribute extends NumberAttribute {
}
exports.FloatAttribute = FloatAttribute;
class NumericAttribute extends NumberAttribute {
    constructor(name, lName, required, precision, scale, minValue, maxValue, defaultValue, semCategories = [], adapter) {
        super(name, lName, required, minValue, maxValue, defaultValue, semCategories, adapter);
        this._precision = precision;
        this._scale = scale;
    }
    get precision() {
        return this._precision;
    }
    get scale() {
        return this._scale;
    }
    inspectDataType() {
        return `${super.inspectDataType()}(${this._precision}, ${Math.abs(this._scale)})`;
    }
    serialize() {
        return {
            ...super.serialize(),
            precision: this._precision,
            scale: this._scale
        };
    }
}
exports.NumericAttribute = NumericAttribute;
class DateAttribute extends NumberAttribute {
    serialize() {
        return super.serialize();
    }
}
exports.DateAttribute = DateAttribute;
class TimeAttribute extends NumberAttribute {
    serialize() {
        return super.serialize();
    }
}
exports.TimeAttribute = TimeAttribute;
class TimeStampAttribute extends NumberAttribute {
    serialize() {
        return super.serialize();
    }
}
exports.TimeStampAttribute = TimeStampAttribute;
class BooleanAttribute extends ScalarAttribute {
    constructor(name, lName, required, defaultValue, semCategories = [], adapter) {
        super(name, lName, required, semCategories, adapter);
        this._defaultValue = defaultValue;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    serialize() {
        return {
            ...super.serialize(),
            defaultValue: this._defaultValue
        };
    }
}
exports.BooleanAttribute = BooleanAttribute;
class BlobAttribute extends ScalarAttribute {
}
exports.BlobAttribute = BlobAttribute;
class EnumAttribute extends ScalarAttribute {
    constructor(name, lName, required, values, defaultValue, semCategories = [], adapter) {
        super(name, lName, required, semCategories, adapter);
        this._values = values;
        this._defaultValue = defaultValue;
    }
    get values() {
        return this._values;
    }
    get defaultValue() {
        return this._defaultValue;
    }
    inspectDataType() {
        return super.inspectDataType() + ' ' + JSON.stringify(this._values);
    }
    serialize() {
        return {
            ...super.serialize(),
            values: this._values,
            defaultValue: this._defaultValue
        };
    }
}
exports.EnumAttribute = EnumAttribute;
class TimeIntervalAttribute extends ScalarAttribute {
}
exports.TimeIntervalAttribute = TimeIntervalAttribute;
class EntityAttribute extends Attribute {
    constructor(name, lName, required, entity, semCategories = [], adapter) {
        super(name, lName, required, semCategories, adapter);
        this._entity = entity;
    }
    get entity() {
        return this._entity;
    }
    serialize() {
        return {
            ...super.serialize(),
            references: this._entity.map(ent => ent.name)
        };
    }
    inspectDataType() {
        return super.inspectDataType() + ' [' + this._entity.reduce((p, e, idx) => p + (idx ? ', ' : '') + e.name, '') + ']';
    }
}
exports.EntityAttribute = EntityAttribute;
class ParentAttribute extends EntityAttribute {
    constructor(name, lName, entity, semCategories = [], adapter) {
        super(name, lName, false, entity, semCategories, adapter);
    }
}
exports.ParentAttribute = ParentAttribute;
class DetailAttribute extends EntityAttribute {
    constructor(name, lName, required, entity, semCategories = [], adapter) {
        super(name, lName, required, entity, semCategories, adapter);
    }
}
exports.DetailAttribute = DetailAttribute;
class SetAttribute extends EntityAttribute {
    constructor(name, lName, required, entity, presLen, semCategories = [], adapter) {
        super(name, lName, required, entity, semCategories, adapter);
        this._attributes = {};
        this._presLen = 0;
        this._presLen = presLen;
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
class Entity {
    constructor(parent, name, lName, isAbstract, semCategories = [], adapter) {
        /*
        if (!/^[a-zA-Z0-9_]+$/.test(name)) {
          throw new Error(`Invalid entity name ${name}`);
        }
        */
        this._pk = [];
        this._attributes = {};
        this._unique = [];
        this.parent = parent;
        this.name = name;
        this.lName = lName;
        this.isAbstract = isAbstract;
        this._semCategories = semCategories;
        this._adapter = adapter;
    }
    get pk() {
        return this._pk;
    }
    get adapter() {
        if (this._adapter) {
            return this._adapter;
        }
        else {
            return rdbadapter_1.relationName2Adapter(this.name);
        }
    }
    get unique() {
        return this._unique;
    }
    get attributes() {
        if (this.parent) {
            return { ...this.parent.attributes, ...this._attributes };
        }
        else {
            return this._attributes;
        }
    }
    get semCategories() {
        return this._semCategories;
    }
    get isTree() {
        return this.hasAttribute('PARENT');
    }
    addUnique(value) {
        this._unique.push(value);
    }
    hasAttribute(name) {
        return (this.parent && this.parent.hasAttribute(name)) || !!this._attributes[name];
    }
    hasOwnAttribute(name) {
        return !!this._attributes[name];
    }
    attribute(name) {
        let found = this._attributes[name];
        if (!found && this.parent) {
            found = this.parent.attribute(name);
        }
        if (!found) {
            throw new Error(`Unknown attribute ${name} of entity ${this.name}`);
        }
        return found;
    }
    attributesBySemCategory(cat) {
        const attrArr = Object.entries(this._attributes).map(([, attr]) => attr);
        return attrArr.filter(attr => attr.semCategories.some(c => c === cat));
    }
    add(attribute) {
        if (this._attributes[attribute.name]) {
            throw new Error(`Attribute ${attribute.name} of entity ${this.name} already exists`);
        }
        if (!this._pk.length && !this.parent) {
            this._pk.push(attribute);
        }
        return this._attributes[attribute.name] = attribute;
    }
    hasAncestor(a) {
        return this.parent ? (this.parent === a ? true : this.parent.hasAncestor(a)) : false;
    }
    serialize() {
        return {
            parent: this.parent ? this.parent.name : undefined,
            name: this.name,
            lName: this.lName,
            isAbstract: this.isAbstract,
            semCategories: gdmn_nlp_1.semCategories2Str(this._semCategories),
            attributes: Object.entries(this.attributes).map(a => a[1].serialize())
        };
    }
    inspect() {
        const lName = this.lName.ru ? ' - ' + this.lName.ru.name : '';
        const result = [
            `${this.isAbstract ? '!' : ''}${this.name}${this.parent ? '(' + this.parent.name + ')' : ''}${lName}:`,
            `  adapter: ${JSON.stringify(this.adapter)}`,
            '  Attributes:',
            ...Object.entries(this.attributes).reduce((p, a) => {
                return [...p, ...a[1].inspect()];
            }, [])
        ];
        if (this._semCategories.length) {
            result.splice(1, 0, `  categories: ${gdmn_nlp_1.semCategories2Str(this._semCategories)}`);
        }
        return result;
    }
}
exports.Entity = Entity;
class Sequence {
    constructor(name, adapter) {
        this._name = name;
        this._adapter = adapter;
    }
    get name() {
        return this._name;
    }
    get adapter() {
        return this._adapter;
    }
}
exports.Sequence = Sequence;
class ERModel {
    constructor() {
        this._entities = {};
        this._sequencies = {};
    }
    get sequencies() {
        return this._sequencies;
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
    addSequence(sequence) {
        if (this._sequencies[sequence.name]) {
            throw new Error(`Sequence ${sequence.name} already exists`);
        }
        return this._sequencies[sequence.name] = sequence;
    }
    serialize() {
        return { entities: Object.entries(this._entities).map(e => e[1].serialize()) };
    }
    inspect() {
        return Object.entries(this._entities).reduce((p, e) => {
            return [...e[1].inspect(), ...p];
        }, []);
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=ermodel.js.map