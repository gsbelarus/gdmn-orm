"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultTransaction_1 = require("./DefaultTransaction");
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
            for (const entity of Object.values(this._entities)) {
                await entity.initDataSource(this._source.getEntitySource());
            }
            for (const sequence of Object.values(this._sequencies)) {
                await sequence.initDataSource(this._source.getSequenceSource());
            }
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
        this._checkTransaction(transaction);
        if (source instanceof Entity_1.Entity) {
            const entity = this.add(source);
            if (this._source) {
                const entitySource = this._source.getEntitySource();
                await entity.initDataSource(entitySource);
                if (entitySource) {
                    return await entitySource.create(transaction, this, entity);
                }
            }
            return entity;
        }
        else if (source instanceof Sequence_1.Sequence) {
            const sequence = this.addSequence(source);
            if (this._source) {
                const sequenceSource = this._source.getSequenceSource();
                if (sequenceSource) {
                    return await sequenceSource.create(transaction, this, sequence);
                }
                await sequence.initDataSource(undefined);
            }
            return source;
        }
        else {
            throw new Error("Unknown arg type");
        }
    }
    async delete(transaction, source) {
        this._checkTransaction(transaction);
        if (source instanceof Entity_1.Entity) {
            const entity = source;
            if (this._source) {
                const entitySource = this._source.getEntitySource();
                if (entitySource) {
                    await entitySource.delete(transaction, this, entity);
                }
                await entity.initDataSource(undefined);
            }
            this.remove(entity);
        }
        else if (source instanceof Sequence_1.Sequence) {
            const sequence = source;
            if (this._source) {
                const sequenceSource = this._source.getSequenceSource();
                if (sequenceSource) {
                    await sequenceSource.delete(transaction, this, sequence);
                }
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
        return new DefaultTransaction_1.DefaultTransaction();
    }
    async commitTransaction(transaction) {
        this._checkTransaction(transaction);
        await transaction.commit();
    }
    async rollbackTransaction(transaction) {
        this._checkTransaction(transaction);
        await transaction.rollback();
    }
    serialize() {
        return { entities: Object.values(this._entities).map((e) => e.serialize()) };
    }
    inspect() {
        return Object.values(this._entities).reduce((p, e) => {
            return [...e.inspect(), ...p];
        }, []);
    }
    _checkTransaction(transaction) {
        if (transaction.finished) {
            throw new Error("Transaction is finished");
        }
    }
}
exports.ERModel = ERModel;
//# sourceMappingURL=ERModel.js.map