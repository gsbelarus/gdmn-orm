/**
 *
 */

import { LName, AttributeAdapter, SequenceAdapter } from './types';
import { IEntity, IAttribute, IERModel } from './interfaces';
import { Entity2RelationMap, relationName2Adapter } from './rdbadapter';

export type ContextVariables = 'CURRENT_TIMESTAMP' | 'CURRENT_TIMESTAMP(0)' | 'CURRENT_DATE' | 'CURRENT_TIME';

export class Attribute {
  private _name: string;
  private _lName: LName;
  private _required: boolean;
  private _calculated: boolean = false;
  readonly adapter?: AttributeAdapter;

  constructor(name: string, lName: LName, required: boolean, adapter?: AttributeAdapter)
  {
    this._name = name;
    this._lName = lName;
    this._required = required;
    this.adapter = adapter;
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

  get calculated() {
    return this._calculated;
  }

  serialize(): IAttribute {
    return {
      name: this.name,
      type: this.constructor.name
    }
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
    } as {[name: string]: string};
    return sn[this.constructor.name] ? sn[this.constructor.name] : this.constructor.name;
  }

  inspect(): string[] {
    const adapter = this.adapter ? ', ' + JSON.stringify(this.adapter) : '';
    const lName = this.lName.ru ? ' - ' + this.lName.ru.name: '';

    return [
      `    ${this._name}${this.required ? '*' : ''}${lName}: ${this.inspectDataType()}${adapter}`
    ];
  }
}

export interface Attributes {
  [name: string]: Attribute
}

export class ScalarAttribute extends Attribute { }

export class StringAttribute extends ScalarAttribute {
  private _minLength?: number;
  private _maxLength?: number;
  private _defaultValue?: string;
  private _mask?: RegExp;
  private _autoTrim: boolean = true;

  constructor(name: string, lName: LName, required: boolean,
    minLength: number | undefined, maxLength: number | undefined,
    defaultValue: string | undefined, autoTrim: boolean,
    mask: RegExp | undefined, adapter?: AttributeAdapter)
  {
    super(name, lName, required, adapter);
    this._minLength = minLength;
    this._maxLength = maxLength;
    this._defaultValue = defaultValue;
    this._autoTrim = autoTrim;
    this._mask = mask;
  }

  inspectDataType() {
    return super.inspectDataType() + (this._maxLength ? '(' + this._maxLength + ')' : '');
  }
}

export class SequenceAttribute extends ScalarAttribute {
  private _sequence: Sequence;

  constructor(name: string, lName: LName, sequence: Sequence, adapter?: AttributeAdapter) {
    super(name, lName, true, adapter);
    this._sequence = sequence;
  }
}

export class NumberAttribute<T, DF = undefined> extends ScalarAttribute {
  private _minValue?: T;
  private _maxValue?: T;
  private _defaultValue?: T | DF;

  constructor(name: string, lName: LName, required: boolean,
    minValue: T | undefined, maxValue: T | undefined,
    defaultValue: T | undefined | DF, adapter?: AttributeAdapter)
  {
    super(name, lName, required, adapter);
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._defaultValue = defaultValue;
  }

  get minValue() {
    return this._minValue;
  }

  set minValue(value) {
    this._minValue = value;
  }

  get maxValue() {
    return this._maxValue;
  }

  set maxValue(value) {
    this._maxValue = value;
  }

  get defaultValue() {
    return this._defaultValue;
  }

  set defaultValue(value) {
    this._defaultValue = value;
  }
}

export class IntegerAttribute extends NumberAttribute<number> { }

export class FloatAttribute extends NumberAttribute<number> { }

export class NumericAttribute extends NumberAttribute<number> {
  private _precision: number;
  private _scale: number;

  constructor(name: string, lName: LName, required: boolean, precision: number,
    scale: number, minValue: number | undefined, maxValue: number | undefined,
    defaultValue: number | undefined, adapter?: AttributeAdapter)
  {
    super(name, lName, required, minValue, maxValue, defaultValue, adapter);
    this._precision = precision;
    this._scale = scale;
  }
}

export class DateAttribute extends NumberAttribute<Date, ContextVariables> { }

export class TimeAttribute extends NumberAttribute<Date, ContextVariables> { }

export class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> { }

export class BooleanAttribute extends ScalarAttribute {
  private _defaultValue: boolean;

  constructor(name: string, lName: LName, required: boolean,
    defaultValue: boolean, adapter?: AttributeAdapter)
  {
    super(name, lName, required, adapter);
    this._defaultValue = defaultValue;
  }

  get defaultValue() {
    return this._defaultValue;
  }

  set defaultValue(value) {
    this._defaultValue = value;
  }
}

export class BLOBAttribute extends ScalarAttribute { }

export interface EnumValue {
  value: string | number;
  lName?: LName;
}

export class EnumAttribute extends ScalarAttribute {
  private _values: EnumValue[];
  private _defaultValue: string | number | undefined;

  constructor(name: string, lName: LName, required: boolean,
    values: EnumValue[], defaultValue: string | number | undefined,
    adapter?: AttributeAdapter)
  {
    super(name, lName, required, adapter);
    this._values = values;
    this._defaultValue = defaultValue;
  }

  get values() {
    return this._values;
  }

  set values(value) {
    this._values = value;
  }

  get defaultValue() {
    return this._defaultValue;
  }

  set defaultValue(value) {
    this._defaultValue = value;
  }

  inspectDataType(): string {
    return super.inspectDataType() + ' ' + JSON.stringify(this._values);
  }
}

export class TimeIntervalAttribute extends ScalarAttribute { }

export class EntityAttribute extends Attribute {
  private _entity: Entity[];

  constructor(name: string, lName: LName, required: boolean, entity: Entity[], adapter?: AttributeAdapter) {
    super(name, lName, required, adapter);
    this._entity = entity;
  }

  get entity() {
    return this._entity;
  }

  serialize(): IAttribute {
    return {
      ...super.serialize(),
      references: this.entity.map( ent => ent.name )
    }
  }

  inspectDataType() {
    return super.inspectDataType() + ' [' + this._entity.reduce( (p, e, idx) => p + (idx ? ', ' : '') + e.name, '') + ']';
  }
}

export class ParentAttribute extends EntityAttribute {
  constructor(name: string, lName: LName, entity: Entity[], adapter?: AttributeAdapter) {
    super(name, lName, false, entity, adapter);
  }
}

export class DetailAttribute extends EntityAttribute { }

export class SetAttribute extends EntityAttribute {
  private _attributes: Attributes = {};

  attribute(name: string) {
    const found = this._attributes[name];
    if (!found) {
      throw new Error(`Unknown attribute ${name}`);
    }
    return found;
  }

  add(attribute: Attribute) {
    if (this._attributes[attribute.name]) {
      throw new Error(`Attribute ${attribute.name} already exists`);
    }

    return this._attributes[attribute.name] = attribute;
  }

  get attributes() {
    return this._attributes;
  }

  serialize(): IAttribute {
    return {
      ...super.serialize(),
      attributes: Object.entries(this._attributes).map( a => a[1].serialize() )
    }
  }
}

export class Entity {
  readonly parent?: Entity;
  readonly name: string;
  readonly lName: LName;
  readonly isAbstract: boolean;
  private _adapter?: Entity2RelationMap;
  private _pk: Attribute[] = [];
  private _attributes: Attributes = {};
  private _unique: Attribute[][] = [];

  constructor(parent: Entity | undefined, name: string, lName: LName,
    isAbstract: boolean, adapter?: Entity2RelationMap)
  {
    this.parent = parent;
    this.name = name;
    this.lName = lName;
    this.isAbstract = isAbstract;
    this._adapter = adapter;
  }

  get pk() {
    return this._pk;
  }

  get adapter(): Entity2RelationMap {
    if (this._adapter) {
      return this._adapter;
    } else {
      return relationName2Adapter(this.name);
    }
  }

  get unique() {
    return this._unique;
  }

  addUnique(value: Attribute[]) {
    this._unique.push(value);
  }

  get attributes(): Attributes {
    if (this.parent) {
      return {...this.parent.attributes, ...this._attributes};
    } else {
      return this._attributes;
    }
  }

  hasAttribute(name: string): boolean {
    return (this.parent && this.parent.hasAttribute(name)) || !!this._attributes[name];
  }

  hasOwnAttribute(name: string): boolean {
    return !!this._attributes[name];
  }

  attribute(name: string) {
    let found = this._attributes[name];
    if (!found && this.parent) {
      found = this.parent.attribute(name);
    }
    if (!found) {
      throw new Error(`Unknown attribute ${name} of entity ${this.name}`);
    }
    return found;
  }

  add(attribute: Attribute) {
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
      attributes: Object.entries(this.attributes).map( a => a[1].serialize() )
    };
  }

  inspect(): string[] {
    const lName = this.lName.ru ? ' - ' + this.lName.ru.name : '';
    return [`${this.name}${this.parent ? '(' + this.parent.name + ')': ''}${lName}:`,
      `  adapter: ${JSON.stringify(this.adapter)}`,
      '  Attributes:',
      ...Object.entries(this.attributes).reduce( (p, a) => {
        return [...p, ...a[1].inspect()];
      }, [] as string[])
    ];
  }
}

export interface Entities {
  [name: string]: Entity
}

export class Sequence {
  private _name: string;
  private _adapter?: SequenceAdapter;

  constructor (name: string, adapter?: SequenceAdapter) {
    this._name = name;
    this._adapter = adapter;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

export interface Sequencies {
  [name: string]: Sequence;
}

export class ERModel {
  private _entities: Entities = {};
  private _sequencies: Sequencies = {};

  get entities() {
    return this._entities;
  }

  entity(name: string) {
    const found = this._entities[name];
    if (!found) {
      throw new Error(`Unknown entity ${name}`);
    }
    return found;
  }

  add(entity: Entity) {
    if (this._entities[entity.name]) {
      throw new Error(`Entity ${entity.name} already exists`);
    }
    return this._entities[entity.name] = entity;
  }

  addSequence(sequence: Sequence) {
    if (this._sequencies[sequence.name]) {
      throw new Error(`Sequence ${sequence.name} already exists`);
    }
    return this._sequencies[sequence.name] = sequence;
  }

  serialize(): IERModel {
    return { entities: Object.entries(this._entities).map( e => e[1].serialize() ) };
  }

  inspect(): string[] {
    return Object.entries(this._entities).reduce( (p, e) => {
      return [...e[1].inspect(), ...p];
    }, [] as string[]);
  }
}