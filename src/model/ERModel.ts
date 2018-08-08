import {IERModel} from '../serialize';
import {Entity} from './Entity';
import {Sequence} from './Sequence';

export interface Entities {
  [name: string]: Entity
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
