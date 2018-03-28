/**
 *
 */

import { DBStructure } from 'gdmn-db';

type LName = string;

export class Attribute {
  readonly name: string;
  readonly lName: LName;

  constructor(name: string, lName: LName) {
    this.name = name;
    this.lName = lName;
  }
}

export class Field extends Attribute {
  readonly fieldName: string;
  readonly notNull: boolean;
  readonly position: number;

  constructor(name: string, lName: LName, fieldName: string, notNull: boolean) {
    super(name, lName);
    this.fieldName = fieldName;
    this.notNull = notNull;
  }
}

export class Constraint extends Attribute {
  readonly constraintName: string;
  readonly attributes: Field[];
}

export class PrimaryKey extends Constraint {
}

export class ForeignKey extends Constraint {
  readonly references: Entity;
}

export class UniqueKey extends Constraint {
}

export class StringField extends Field {
}

export class NumericField extends Field {
}

export class SetAttribute extends Attribute {
  readonly associativeEntity: Entity;
}

export class WeakAtribute extends Attribute {
  readonly weakEntity: Entity;
}

interface Attributes {
  [name: string]: Attribute
}

export class Entity {
  readonly parent?: Entity;
  readonly name: string;
  readonly relName: LName;
  readonly lName: LName;
  readonly attributes: Attributes;

  constructor(parent: Entity | undefined, name: string, relName: LName, lName: LName) {
    this.parent = parent;
    this.name = name;
    this.relName = relName;
    this.lName = lName;
    this.attributes = {};
  }
}

interface Entities {
  [name: string]: Entity
}

export class ERModel {
  private entities: Entities = {};

  entity(name: string) {
    return this.entities[name];
  }

  add(name: string, relName: LName, lName: LName) {
    const entity = new Entity(undefined, name, relName, lName);
    this.entities[name] = entity;
    return entity;
  }
}