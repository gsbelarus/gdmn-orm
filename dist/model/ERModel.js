"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("./Entity");
const Sequence_1 = require("./Sequence");
class ERModel {
    constructor() {
        this._entities = {};
        this._sequencies = {};
    }
    get sequencies() {
        return this._sequencies;
    }
    get entities() {
        return this._entities;
    }
    async initDataSource(_source) {
        this._source = _source;
        if (this._source) {
            await this._source.init(this);
        }
    }
    entity(name) {
        const found = this._entities[name];
        if (!found) {
            throw new Error(`Unknown entity ${name}`);
        }
        return found;
    }
    sequence(name) {
        const found = this._sequencies[name];
        if (!found) {
            throw new Error(`Unknown sequence ${name}`);
        }
        return found;
    }
    hasEntity(name) {
        return !!this._entities[name];
    }
    hasSequence(name) {
        return !!this._sequencies[name];
    }
    add(entity) {
        if (this.hasEntity(entity.name)) {
            throw new Error(`Entity ${entity.name} already exists`);
        }
        return this._entities[entity.name] = entity;
    }
    remove(entity) {
        if (!this.hasEntity(entity.name)) {
            throw new Error(`Entity ${entity.name} not found`);
        }
        delete this.entities[entity.name];
    }
    addSequence(sequence) {
        if (this.hasSequence(sequence.name)) {
            throw new Error(`Sequence ${sequence.name} already exists`);
        }
        return this._sequencies[sequence.name] = sequence;
    }
    removeSequence(sequence) {
        if (!this.hasSequence(sequence.name)) {
            throw new Error(`Sequence ${sequence.name} not found`);
        }
        delete this._sequencies[sequence.name];
    }
    has(source) {
        if (source instanceof Entity_1.Entity) {
            return !!this._entities[source.name];
        }
        else if (source instanceof Sequence_1.Sequence) {
            return !!this._sequencies[source.name];
        }
        else {
            throw new Error("Unknown arg type");
        }
    }
    async create(transaction, source) {
        if (source instanceof Entity_1.Entity) {
            const entity = this.add(source);
            if (this._source) {
                const entitySource = this._source.getEntitySource();
                await entity.initDataSource(entitySource);
                return await entitySource.create(transaction, this, entity);
            }
            return entity;
        }
        else if (source instanceof Sequence_1.Sequence) {
            const sequence = this.addSequence(source);
            if (this._source) {
                const sequenceSource = this._source.getSequenceSource();
                return await sequenceSource.create(transaction, this, sequence);
            }
            return source;
        }
        else {
            throw new Error("Unknown arg type");
        }
    }
    async delete(transaction, source) {
        if (source instanceof Entity_1.Entity) {
            const entity = source;
            if (this._source) {
                const entitySource = this._source.getEntitySource();
                await entitySource.delete(transaction, this, entity);
                await entity.initDataSource(undefined);
            }
            this.remove(entity);
        }
        else if (source instanceof Sequence_1.Sequence) {
            const sequence = source;
            if (this._source) {
                const sequenceSource = this._source.getSequenceSource();
                await sequenceSource.delete(transaction, this, sequence);
            }
            this.removeSequence(source);
        }
        else {
            throw new Error("Unknown arg type");
        }
    }
    async startTransaction() {
        if (this._source) {
            return await this._source.startTransaction();
        }
        return { active: true };
    }
    async commitTransaction(transaction) {
        if (this._source && transaction.active) {
            await this._source.commitTransaction(transaction);
        }
    }
    async rollbackTransaction(transaction) {
        if (this._source && transaction.active) {
            await this._source.rollbackTransaction(transaction);
        }
    }
    serialize() {
        return { entities: Object.entries(this._entities).map((e) => e[1].serialize()) };
    }
    inspect() {
        return Object.entries(this._entities).reduce((p, e) => {
            return [...e[1].inspect(), ...p];
        }, []);
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=ERModel.js.map