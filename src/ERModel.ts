/**
 *
 */

import { DBStructure } from 'gdmn-db';

export class Attribute {
  readonly name: string;
  readonly lName: string;

  constructor(name: string, lName: string) {
    this.name = name;
    this.lName = lName;
  }
}

export class Field extends Attribute {
  readonly fieldName: string;
  readonly notNull: boolean;
  readonly position: number;

  constructor(name: string, lName: string, fieldName: string, notNull: boolean) {
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
  readonly relName: string;
  readonly lName: string;
  readonly attributes: Attributes;

  constructor(parent: Entity | undefined, relName: string, lName: string) {
    this.parent = parent;
    this.relName = relName;
    this.lName = lName;
    this.attributes = {};
  }
}

interface Entities {
  [name: string]: Entity
}

export class ERModel {
  entities: Entities = {};

  load (dbStruct: DBStructure) {

  }
}