"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_nlp_1 = require("gdmn-nlp");
class Attribute {
    constructor(options) {
        this._name = options.name;
        this._lName = options.lName;
        this._required = options.required || false;
        this._semCategories = options.semCategories || [];
        this._adapter = options.adapter;
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
    async initDataSource(source) {
        this._source = source;
        if (this._source) {
            await this._source.init(this);
        }
    }
    serialize() {
        return {
            name: this.name,
            type: this.constructor.name,
            lName: this._lName,
            required: this._required,
            semCategories: gdmn_nlp_1.semCategories2Str(this._semCategories)
        };
    }
    inspectDataType() {
        const sn = {
            EntityAttribute: "->",
            StringAttribute: "S",
            SetAttribute: "<->",
            ParentAttribute: "-^",
            SequenceAttribute: "PK",
            IntegerAttribute: "I",
            NumericAttribute: "N",
            FloatAttribute: "F",
            BooleanAttribute: "B",
            DateAttribute: "DT",
            TimeStampAttribute: "TS",
            TimeAttribute: "TM",
            BlobAttribute: "BLOB",
            EnumAttribute: "E"
        };
        return sn[this.constructor.name] ? sn[this.constructor.name] : this.constructor.name;
    }
    inspect(indent = "    ") {
        const adapter = this.adapter ? ", " + JSON.stringify(this.adapter) : "";
        const lName = this.lName.ru ? " - " + this.lName.ru.name : "";
        const cat = this._semCategories.length ? `, categories: ${gdmn_nlp_1.semCategories2Str(this._semCategories)}` : "";
        return [
            `${indent}${this._name}${this.required ? "*" : ""}${lName}: ${this.inspectDataType()}${cat}${adapter}`
        ];
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map