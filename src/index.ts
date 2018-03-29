/**
 *
 */

import { DBStructure } from 'gdmn-db';

export type LName = string;

export class Attribute {
  readonly name: string;
  readonly lName?: LName;

  constructor(name: string, lName?: LName) {
    this.name = name;
    this.lName = lName;
  }
}

export interface Attributes {
  [name: string]: Attribute
}

export class Field extends Attribute {
  private _notNull: boolean = false;
  private _position: number = 0;

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

export interface Fields {
  [name: string]: Field
}

export class Constraint extends Attribute {
  readonly fields: Fields;

  findField(name: string) {
    return this.fields[name];
  }

  field(name: string) {
    const found = this.findField(name);
    if (!found) {
      throw new Error(`Unknown field ${name}`);
    }
    return found;
  }

  add(field: Field) {
    if (this.findField(field.name)) {
      throw new Error(`Field ${field.name} already exists`);
    }
    return this.fields[field.name] = field;
  }
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

export class IntegerField extends NumericField {
}

export class SetAttribute extends Attribute {
  readonly associativeEntity: Entity;
}

export class WeakAtribute extends Attribute {
  readonly weakEntity: Entity;
}

export class Entity {
  readonly parent?: Entity;
  readonly name: string;
  readonly relName: string;
  readonly lName?: LName;
  private _attributes: Attributes = {};

  constructor(parent: Entity | undefined, name: string, relName: string, lName?: LName) {
    this.parent = parent;
    this.name = name;
    this.relName = relName;
    this.lName = lName;
  }

  findAttribute(name: string) {
    return this._attributes[name];
  }

  attribute(name: string) {
    const found = this.findAttribute(name);
    if (!found) {
      throw new Error(`Unknown attribute ${name}`);
    }
    return found;
  }

  add(attribute: Attribute) {
    if (this.findAttribute(attribute.name)) {
      throw new Error(`Attribute ${attribute.name} already exists`);
    }
    return this._attributes[attribute.name] = attribute;
  }
}

export interface Entities {
  [name: string]: Entity
}

export class ERModel {
  private entities: Entities = {};

  findEntity(name:string) {
    return this.entities[name];
  }

  entity(name: string) {
    const found = this.findEntity(name);
    if (!found) {
      throw new Error(`Unknown entity ${name}`);
    }
    return found;
  }

  add(entity: Entity) {
    if (this.findEntity(entity.name)) {
      throw new Error(`Entity ${entity.name} already exists`);
    }
    return this.entities[entity.name] = entity;
  }
}