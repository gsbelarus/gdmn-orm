"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_nlp_1 = require("gdmn-nlp");
const rdbadapter_1 = require("../rdbadapter");
class Entity {
    constructor(options) {
        /*
        if (!/^[a-zA-Z0-9_]+$/.test(name)) {
          throw new Error(`Invalid entity name ${name}`);
        }
        */
        this._pk = [];
        this._attributes = {};
        this._unique = [];
        this._parent = options.parent || undefined;
        this._name = options.name;
        this._lName = options.lName;
        this._isAbstract = options.isAbstract || false;
        this._semCategories = options.semCategories || [];
        this._adapter = options.adapter;
    }
    get pk() {
        return this._pk;
    }
    get parent() {
        return this._parent;
    }
    get lName() {
        return this._lName;
    }
    get name() {
        return this._name;
    }
    get isAbstract() {
        return this._isAbstract;
    }
    get adapter() {
        if (this._adapter) {
            return this._adapter;
        }
        else {
            return rdbadapter_1.relationName2Adapter(this._name);
        }
    }
    get unique() {
        return this._unique;
    }
    get attributes() {
        if (this._parent) {
            return { ...this._parent.attributes, ...this._attributes };
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
        return (this._parent && this._parent.hasAttribute(name)) || !!this._attributes[name];
    }
    hasOwnAttribute(name) {
        return !!this._attributes[name];
    }
    attribute(name) {
        let found = this._attributes[name];
        if (!found && this._parent) {
            found = this._parent.attribute(name);
        }
        if (!found) {
            throw new Error(`Unknown attribute ${name} of entity ${this._name}`);
        }
        return found;
    }
    attributesBySemCategory(cat) {
        const attrArr = Object.entries(this._attributes).map(([, attr]) => attr);
        return attrArr.filter(attr => attr.semCategories.some(c => c === cat));
    }
    add(attribute) {
        if (this._attributes[attribute.name]) {
            throw new Error(`Attribute ${attribute.name} of entity ${this._name} already exists`);
        }
        if (!this._pk.length && !this._parent) {
            this._pk.push(attribute);
        }
        return this._attributes[attribute.name] = attribute;
    }
    hasAncestor(a) {
        return this._parent ? (this._parent === a ? true : this._parent.hasAncestor(a)) : false;
    }
    serialize() {
        return {
            parent: this._parent ? this._parent._name : undefined,
            name: this._name,
            lName: this._lName,
            isAbstract: this._isAbstract,
            semCategories: gdmn_nlp_1.semCategories2Str(this._semCategories),
            attributes: Object.entries(this.attributes).map(a => a[1].serialize())
        };
    }
    inspect() {
        const lName = this._lName.ru ? ' - ' + this._lName.ru.name : '';
        const result = [
            `${this._isAbstract ? '!' : ''}${this._name}${this._parent ? '(' + this._parent._name + ')' : ''}${lName}:`,
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
//# sourceMappingURL=Entity.js.map