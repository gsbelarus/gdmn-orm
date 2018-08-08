/**
 *
 */

import {semCategories2Str, SemCategory} from 'gdmn-nlp';
import {
  AttributeAdapter1,
  DetailAttributeAdapter, EntityAdapter,
  relationName2Adapter,
  SequenceAdapter,
  SetAttributeAdapter
} from './rdbadapter';
import {
  AttributeClasses,
  IAttribute,
  IBooleanAttribute,
  IDateAttribute,
  IEntity,
  IEntityAttribute,
  IEnumAttribute,
  IERModel,
  INumberAttribute,
  INumericAttribute,
  ISequenceAttribute,
  ISetAttribute,
  IStringAttribute
} from './serialize';
import {ContextVariables, EnumValue, LName} from './types';

export class Attribute<Adapter = any> {

  protected _adapter?: Adapter;

  private readonly _name: string;
  private readonly _lName: LName;
  private readonly _required: boolean;
  private readonly _semCategories: SemCategory[];
  private readonly _calculated: boolean = false;

  constructor(name: string,
              lName: LName,
              required: boolean,
              semCategories: SemCategory[] = [],
              adapter?: Adapter) {
    this._name = name;
    this._lName = lName;
    this._required = required;
    this._semCategories = semCategories;
    this._adapter = adapter;
  }

  get adapter(): Adapter | undefined {
    return this._adapter;
  }

  get name(): string {
    return this._name;
  }

  get lName(): LName {
    return this._lName;
  }

  get required(): boolean {
    return this._required;
  }

  get semCategories(): SemCategory[] {
    return this._semCategories;
  }

  get calculated(): boolean {
    return this._calculated;
  }

  serialize(): IAttribute {
    return {
      name: this.name,
      type: this.constructor.name as AttributeClasses,
      lName: this._lName,
      required: this._required,
      semCategories: semCategories2Str(this._semCategories),
      calculated: this._calculated
    };
  }

  inspectDataType(): string {
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
    } as { [name: string]: string };
    return sn[this.constructor.name] ? sn[this.constructor.name] : this.constructor.name;
  }

  inspect(indent: string = '    '): string[] {
    const adapter = this.adapter ? ', ' + JSON.stringify(this.adapter) : '';
    const lName = this.lName.ru ? ' - ' + this.lName.ru.name : '';
    const cat = this._semCategories.length ? `, categories: ${semCategories2Str(this._semCategories)}` : '';

    return [
      `${indent}${this._name}${this.required ? '*' : ''}${lName}: ${this.inspectDataType()}${cat}${adapter}`
    ];
  }
}

export interface Attributes {
  [name: string]: Attribute
}

export class ScalarAttribute extends Attribute<AttributeAdapter1> {
}

export class StringAttribute extends ScalarAttribute {

  private readonly _minLength?: number;
  private readonly _maxLength?: number;
  private readonly _defaultValue?: string;
  private readonly _mask?: RegExp;
  private readonly _autoTrim: boolean = true;

  constructor(name: string,
              lName: LName,
              required: boolean,
              minLength: number | undefined,
              maxLength: number | undefined,
              defaultValue: string | undefined,
              autoTrim: boolean,
              mask: RegExp | undefined,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, required, semCategories, adapter);
    this._minLength = minLength;
    this._maxLength = maxLength;
    this._defaultValue = defaultValue;
    this._autoTrim = autoTrim;
    this._mask = mask;
  }

  get minLength(): number | undefined {
    return this._minLength;
  }

  get maxLength(): number | undefined {
    return this._maxLength;
  }

  get defaultValue(): string | undefined {
    return this._defaultValue;
  }

  get mask(): RegExp | undefined {
    return this._mask;
  }

  get autoTrim(): boolean {
    return this._autoTrim;
  }

  serialize(): IStringAttribute {
    return {
      ...super.serialize(),
      minLength: this._minLength,
      maxLength: this._maxLength,
      defaultValue: this._defaultValue,
      mask: this._mask,
      autoTrim: this._autoTrim
    };
  }

  inspectDataType(): string {
    return super.inspectDataType() + (this._maxLength ? '(' + this._maxLength + ')' : '');
  }
}

export class SequenceAttribute extends ScalarAttribute {

  private readonly _sequence: Sequence;

  constructor(name: string,
              lName: LName,
              sequence: Sequence,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, true, semCategories, adapter);
    this._sequence = sequence;
  }

  get sequence(): Sequence {
    return this._sequence;
  }

  serialize(): ISequenceAttribute {
    return {
      ...super.serialize(),
      sequence: this._sequence.name
    };
  }
}

export class NumberAttribute<T, DF = undefined> extends ScalarAttribute {

  private readonly _minValue?: T;
  private readonly _maxValue?: T;
  private readonly _defaultValue?: T | DF;

  constructor(name: string,
              lName: LName,
              required: boolean,
              minValue: T | undefined,
              maxValue: T | undefined,
              defaultValue: T | undefined | DF,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, required, semCategories, adapter);
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._defaultValue = defaultValue;
  }

  get minValue(): T | undefined {
    return this._minValue;
  }

  get maxValue(): T | undefined {
    return this._maxValue;
  }

  get defaultValue(): T | DF | undefined {
    return this._defaultValue;
  }

  serialize(): INumberAttribute<T, DF> {
    return {
      ...super.serialize(),
      minValue: this._minValue,
      maxValue: this._maxValue,
      defaultValue: this._defaultValue
    };
  }
}

export class IntegerAttribute extends NumberAttribute<number> {
}

export class FloatAttribute extends NumberAttribute<number> {
}

export class NumericAttribute extends NumberAttribute<number> {

  private readonly _precision: number;
  private readonly _scale: number;

  constructor(name: string,
              lName: LName,
              required: boolean,
              precision: number,
              scale: number,
              minValue: number | undefined,
              maxValue: number | undefined,
              defaultValue: number | undefined,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, required, minValue, maxValue, defaultValue, semCategories, adapter);
    this._precision = precision;
    this._scale = scale;
  }

  get precision(): number {
    return this._precision;
  }

  get scale(): number {
    return this._scale;
  }

  inspectDataType(): string {
    return `${super.inspectDataType()}(${this._precision}, ${Math.abs(this._scale)})`;
  }

  serialize(): INumericAttribute {
    return {
      ...super.serialize(),
      precision: this._precision,
      scale: this._scale
    };
  }
}

export class DateAttribute extends NumberAttribute<Date, ContextVariables> {
  serialize(): IDateAttribute {
    return super.serialize();
  }
}

export class TimeAttribute extends NumberAttribute<Date, ContextVariables> {
  serialize(): IDateAttribute {
    return super.serialize();
  }
}

export class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> {
  serialize(): IDateAttribute {
    return super.serialize();
  }
}

export class BooleanAttribute extends ScalarAttribute {

  private readonly _defaultValue: boolean;

  constructor(name: string,
              lName: LName,
              required: boolean,
              defaultValue: boolean,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, required, semCategories, adapter);
    this._defaultValue = defaultValue;
  }

  get defaultValue(): boolean {
    return this._defaultValue;
  }

  serialize(): IBooleanAttribute {
    return {
      ...super.serialize(),
      defaultValue: this._defaultValue
    };
  }
}

export class BlobAttribute extends ScalarAttribute {
}

export class EnumAttribute extends ScalarAttribute {

  private readonly _values: EnumValue[];
  private readonly _defaultValue: string | number | undefined;

  constructor(name: string,
              lName: LName,
              required: boolean,
              values: EnumValue[],
              defaultValue: string | number | undefined,
              semCategories: SemCategory[] = [],
              adapter?: AttributeAdapter1) {
    super(name, lName, required, semCategories, adapter);
    this._values = values;
    this._defaultValue = defaultValue;
  }

  get values(): EnumValue[] {
    return this._values;
  }

  get defaultValue(): string | number | undefined {
    return this._defaultValue;
  }

  inspectDataType(): string {
    return super.inspectDataType() + ' ' + JSON.stringify(this._values);
  }

  serialize(): IEnumAttribute {
    return {
      ...super.serialize(),
      values: this._values,
      defaultValue: this._defaultValue
    };
  }
}

export class TimeIntervalAttribute extends ScalarAttribute {
}

export class EntityAttribute<Adapter = any> extends Attribute<Adapter> {

  private readonly _entity: Entity[];

  constructor(name: string,
              lName: LName,
              required: boolean,
              entity: Entity[],
              semCategories: SemCategory[] = [],
              adapter?: Adapter) {
    super(name, lName, required, semCategories, adapter);
    this._entity = entity;
  }

  get entity() {
    return this._entity;
  }

  serialize(): IEntityAttribute {
    return {
      ...super.serialize(),
      references: this._entity.map(ent => ent.name)
    };
  }

  inspectDataType() {
    return super.inspectDataType() + ' [' + this._entity.reduce((p, e, idx) => p + (idx ? ', ' : '') + e.name, '') + ']';
  }
}

export class ParentAttribute extends EntityAttribute {

  constructor(name: string,
              lName: LName,
              entity: Entity[],
              semCategories: SemCategory[] = [],
              adapter?: string) {
    super(name, lName, false, entity, semCategories, adapter);
  }
}

export class DetailAttribute extends EntityAttribute<DetailAttributeAdapter> {

  constructor(name: string,
              lName: LName,
              required: boolean,
              entity: Entity[],
              semCategories: SemCategory[] = [],
              adapter?: DetailAttributeAdapter) {
    super(name, lName, required, entity, semCategories, adapter);
  }
}

export class SetAttribute extends EntityAttribute<SetAttributeAdapter> {

  private readonly _attributes: Attributes = {};
  private readonly _presLen: number = 0;

  constructor(name: string,
              lName: LName,
              required: boolean,
              entity: Entity[],
              presLen: number,
              semCategories: SemCategory[] = [],
              adapter?: SetAttributeAdapter) {
    super(name, lName, required, entity, semCategories, adapter);
    this._presLen = presLen;
  }

  get attributes(): Attributes {
    return this._attributes;
  }

  attribute(name: string): Attribute | never {
    const found = this._attributes[name];
    if (!found) {
      throw new Error(`Unknown attribute ${name}`);
    }
    return found;
  }

  add(attribute: Attribute): Attribute | never {
    if (this._attributes[attribute.name]) {
      throw new Error(`Attribute ${attribute.name} already exists`);
    }

    return this._attributes[attribute.name] = attribute;
  }

  serialize(): ISetAttribute {
    return {
      ...super.serialize(),
      attributes: Object.entries(this._attributes).map(a => a[1].serialize()),
      presLen: this._presLen
    };
  }

  inspect(indent: string = '    '): string[] {
    const result = super.inspect();
    return [...result,
      ...Object.entries(this._attributes).reduce((p, a) => {
        return [...p, ...a[1].inspect(indent + '  ')];
      }, [] as string[])
    ];
  }
}

export class Entity {

  readonly parent?: Entity;
  readonly name: string;
  readonly lName: LName;
  readonly isAbstract: boolean;
  private readonly _adapter?: EntityAdapter;
  private readonly _pk: Attribute[] = [];
  private readonly _attributes: Attributes = {};
  private readonly _unique: Attribute[][] = [];
  private readonly _semCategories: SemCategory[];

  constructor(parent: Entity | undefined,
              name: string,
              lName: LName,
              isAbstract: boolean,
              semCategories: SemCategory[] = [],
              adapter?: EntityAdapter) {
    /*
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error(`Invalid entity name ${name}`);
    }
    */

    this.parent = parent;
    this.name = name;
    this.lName = lName;
    this.isAbstract = isAbstract;
    this._semCategories = semCategories;
    this._adapter = adapter;
  }

  get pk(): Attribute[] {
    return this._pk;
  }

  get adapter(): EntityAdapter {
    if (this._adapter) {
      return this._adapter;
    } else {
      return relationName2Adapter(this.name);
    }
  }

  get unique(): Attribute[][] {
    return this._unique;
  }

  get attributes(): Attributes {
    if (this.parent) {
      return {...this.parent.attributes, ...this._attributes};
    } else {
      return this._attributes;
    }
  }

  get semCategories(): SemCategory[] {
    return this._semCategories;
  }

  get isTree(): boolean {
    return this.hasAttribute('PARENT');
  }

  addUnique(value: Attribute[]): void {
    this._unique.push(value);
  }

  hasAttribute(name: string): boolean {
    return (this.parent && this.parent.hasAttribute(name)) || !!this._attributes[name];
  }

  hasOwnAttribute(name: string): boolean {
    return !!this._attributes[name];
  }

  attribute(name: string): Attribute | never {
    let found = this._attributes[name];
    if (!found && this.parent) {
      found = this.parent.attribute(name);
    }
    if (!found) {
      throw new Error(`Unknown attribute ${name} of entity ${this.name}`);
    }
    return found;
  }

  attributesBySemCategory(cat: SemCategory): Attribute[] {
    const attrArr = Object.entries(this._attributes).map(([, attr]) => attr);
    return attrArr.filter(attr => attr.semCategories.some(c => c === cat));
  }

  add(attribute: Attribute): Attribute | never {
    if (this._attributes[attribute.name]) {
      throw new Error(`Attribute ${attribute.name} of entity ${this.name} already exists`);
    }

    if (!this._pk.length && !this.parent) {
      this._pk.push(attribute);
    }

    return this._attributes[attribute.name] = attribute;
  }

  hasAncestor(a: Entity): boolean {
    return this.parent ? (this.parent === a ? true : this.parent.hasAncestor(a)) : false;
  }

  serialize(): IEntity {
    return {
      parent: this.parent ? this.parent.name : undefined,
      name: this.name,
      lName: this.lName,
      isAbstract: this.isAbstract,
      semCategories: semCategories2Str(this._semCategories),
      attributes: Object.entries(this.attributes).map(a => a[1].serialize())
    };
  }

  inspect(): string[] {
    const lName = this.lName.ru ? ' - ' + this.lName.ru.name : '';
    const result = [
      `${this.isAbstract ? '!' : ''}${this.name}${this.parent ? '(' + this.parent.name + ')' : ''}${lName}:`,
      `  adapter: ${JSON.stringify(this.adapter)}`,
      '  Attributes:',
      ...Object.entries(this.attributes).reduce((p, a) => {
        return [...p, ...a[1].inspect()];
      }, [] as string[])
    ];
    if (this._semCategories.length) {
      result.splice(1, 0, `  categories: ${semCategories2Str(this._semCategories)}`);
    }
    return result;
  }
}

export interface Entities {
  [name: string]: Entity
}

export class Sequence<Adapter = SequenceAdapter> {

  private readonly _name: string;
  private readonly _adapter?: Adapter;

  constructor(name: string, adapter?: Adapter) {
    this._name = name;
    this._adapter = adapter;
  }

  get name(): string {
    return this._name;
  }

  get adapter(): Adapter | undefined {
    return this._adapter;
  }
}

export interface Sequencies {
  [name: string]: Sequence;
}

export class ERModel {

  private _entities: Entities = {};
  private _sequencies: Sequencies = {};

  get sequencies(): Sequencies {
    return this._sequencies;
  }

  get entities(): Entities {
    return this._entities;
  }

  entity(name: string): Entity | never {
    const found = this._entities[name];
    if (!found) {
      throw new Error(`Unknown entity ${name}`);
    }
    return found;
  }

  add(entity: Entity): Entity | never {
    if (this._entities[entity.name]) {
      throw new Error(`Entity ${entity.name} already exists`);
    }
    return this._entities[entity.name] = entity;
  }

  addSequence(sequence: Sequence): Sequence | never {
    if (this._sequencies[sequence.name]) {
      throw new Error(`Sequence ${sequence.name} already exists`);
    }
    return this._sequencies[sequence.name] = sequence;
  }

  serialize(): IERModel {
    return {entities: Object.entries(this._entities).map(e => e[1].serialize())};
  }

  inspect(): string[] {
    return Object.entries(this._entities).reduce((p, e) => {
      return [...e[1].inspect(), ...p];
    }, [] as string[]);
  }
}
