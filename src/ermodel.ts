/**
 *
 */

import { LName, EntityAdapter, AttributeAdapter } from './types';
import { Sequence2SequenceMap } from './rdbadapter';

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
}

export interface Attributes {
  [name: string]: Attribute
}

export class ScalarAttribute extends Attribute { }

export class StringAttribute extends ScalarAttribute {
  private _minLength?: number;
  private _maxLength?: number;
  private _default?: string;
  private _mask?: RegExp;
}

export class NumberAttribute extends ScalarAttribute {
  private _minValue?: number;
  private _maxValue?: number;
  private _defaultValue?: number;

  constructor(name: string, lName: LName, required: boolean,
    minValue: number | undefined, maxValue: number | undefined,
    defaultValue: number | undefined, adapter?: AttributeAdapter)
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

export class IntegerAttribute extends NumberAttribute { }

export class FloatAttribute extends NumberAttribute { }

export class NumericAttribute extends NumberAttribute { }

export class DateAttribute extends ScalarAttribute { }

export class TimeAttribute extends ScalarAttribute { }

export class TimeStampAttribute extends ScalarAttribute { }

export class BooleanAttribute extends ScalarAttribute { }

export class EnumAttribute extends ScalarAttribute { }

export class TimeIntervalAttribute extends ScalarAttribute { }

export class EntityAttribute extends Attribute {
  private _entity: Entity[];

  constructor(name: string, lName: LName, required: boolean, entity: Entity[], adapter?: AttributeAdapter) {
    super(name, lName, required, adapter);
    this._entity = entity;
  }
}

export class ParentAttribute extends EntityAttribute {
  constructor(name: string, lName: LName, entity: Entity[], adapter?: AttributeAdapter) {
    super(name, lName, false, entity, adapter);
  }
}

export class DetailAttribute extends EntityAttribute { }

export class SetAttribute extends EntityAttribute {
  private _fields: Attributes;
}

export class Entity {
  readonly parent?: Entity;
  readonly name: string;
  readonly lName: LName;
  readonly isAbstract: boolean;
  readonly adapter?: EntityAdapter;
  private _pk: Attribute[] = [];
  private _attributes: Attributes = {};
  private _generator

  constructor(parent: Entity | undefined, name: string, lName: LName,
    isAbstract: boolean, sequence: Sequence | undefined, adapter?: EntityAdapter)
  {
    this.parent = parent;
    this.name = name;
    this.lName = lName;
    this.isAbstract = isAbstract;
    this.adapter = adapter;
  }

  get pk() {
    return this._pk;
  }

  get attributes() {
    return this._attributes;
  }

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

    if (!this._pk.length) {
      this._pk.push(attribute);
    }

    return this._attributes[attribute.name] = attribute;
  }
}

export interface Entities {
  [name: string]: Entity
}

export class Sequence {
  private _name: string;
  private _adapter?: Sequence2SequenceMap;

  constructor (name: string, adapter?: Sequence2SequenceMap) {
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
}