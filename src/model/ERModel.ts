import {IERModel} from "../serialize";
import {IDataSource, ITransaction} from "../types";
import {Entity} from "./Entity";
import {Sequence} from "./Sequence";

export interface IEntities {
  [name: string]: Entity;
}

export interface ISequencies {
  [name: string]: Sequence;
}

export class ERModel {

  private _source?: IDataSource;

  private _entities: IEntities = {};
  private _sequencies: ISequencies = {};

  get sequencies(): ISequencies {
    return this._sequencies;
  }

  get entities(): IEntities {
    return this._entities;
  }

  public async initDataSource(_source?: IDataSource): Promise<void> {
    this._source = _source;
    if (this._source) {
      await this._source.init(this);
    }
  }

  public entity(name: string): Entity | never {
    const found = this._entities[name];
    if (!found) {
      throw new Error(`Unknown entity ${name}`);
    }
    return found;
  }

  public sequence(name: string): Sequence {
    const found = this._sequencies[name];
    if (!found) {
      throw new Error(`Unknown sequence ${name}`);
    }
    return found;
  }

  public hasEntity(name: string): boolean {
    return !!this._entities[name];
  }

  public hasSequence(name: string): boolean {
    return !!this._sequencies[name];
  }

  public add(entity: Entity): Entity {
    if (this.hasEntity(entity.name)) {
      throw new Error(`Entity ${entity.name} already exists`);
    }
    return this._entities[entity.name] = entity;
  }

  public remove(entity: Entity): void {
    if (!this.hasEntity(entity.name)) {
      throw new Error(`Entity ${entity.name} not found`);
    }
    delete this.entities[entity.name];
  }

  public addSequence(sequence: Sequence): Sequence | never {
    if (this.hasSequence(sequence.name)) {
      throw new Error(`Sequence ${sequence.name} already exists`);
    }
    return this._sequencies[sequence.name] = sequence;
  }

  public removeSequence(sequence: Sequence): void {
    if (!this.hasSequence(sequence.name)) {
      throw new Error(`Sequence ${sequence.name} not found`);
    }
    delete this._sequencies[sequence.name];
  }

  public has(sequence: Sequence): boolean;
  public has(entity: Entity): boolean;
  public has(source: any): boolean {
    if (source instanceof Entity) {
      return !!this._entities[source.name];

    } else if (source instanceof Sequence) {
      return !!this._sequencies[source.name];
    } else {
      throw new Error("Unknown arg type");
    }
  }

  public async create(transaction: ITransaction, sequence: Sequence): Promise<Sequence>;
  public async create(transaction: ITransaction, entity: Entity): Promise<Entity>;
  public async create(transaction: ITransaction, source: any): Promise<any> {
    if (source instanceof Entity) {
      const entity = this.add(source);
      if (this._source) {
        const entitySource = this._source.getEntitySource();
        await entity.initDataSource(entitySource);
        return await entitySource.create(transaction, this, entity);
      }
      return entity;

    } else if (source instanceof Sequence) {
      const sequence = this.addSequence(source);
      if (this._source) {
        const sequenceSource = this._source.getSequenceSource();
        return await sequenceSource.create(transaction, this, sequence);
      }
      return source;
    } else {
      throw new Error("Unknown arg type");
    }
  }

  public async delete(transaction: ITransaction, sequence: Sequence): Promise<void>;
  public async delete(transaction: ITransaction, entity: Entity): Promise<void>;
  public async delete(transaction: ITransaction, source: any): Promise<void> {
    if (source instanceof Entity) {
      const entity = source;
      if (this._source) {
        const entitySource = this._source.getEntitySource();
        await entitySource.delete(transaction, this, entity);
        await entity.initDataSource(undefined);
      }
      this.remove(entity);

    } else if (source instanceof Sequence) {
      const sequence = source;
      if (this._source) {
        const sequenceSource = this._source.getSequenceSource();
        await sequenceSource.delete(transaction, this, sequence);
      }
      this.removeSequence(source);
    } else {
      throw new Error("Unknown arg type");
    }
  }

  public async startTransaction(): Promise<ITransaction> {
    if (this._source) {
      return await this._source.startTransaction();
    }
    return {active: true};
  }

  public async commitTransaction(transaction: ITransaction): Promise<void> {
    if (this._source && transaction.active) {
      await this._source.commitTransaction(transaction);
    }
  }

  public async rollbackTransaction(transaction: ITransaction): Promise<void> {
    if (this._source && transaction.active) {
      await this._source.rollbackTransaction(transaction);
    }
  }

  public serialize(): IERModel {
    return {entities: Object.entries(this._entities).map((e) => e[1].serialize())};
  }

  public inspect(): string[] {
    return Object.entries(this._entities).reduce((p, e) => {
      return [...e[1].inspect(), ...p];
    }, [] as string[]);
  }
}
