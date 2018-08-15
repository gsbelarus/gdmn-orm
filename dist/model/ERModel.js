"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    entity(name) {
        const found = this._entities[name];
        if (!found) {
            throw new Error(`Unknown entity ${name}`);
        }
        return found;
    }
    add(entity) {
        if (this._entities[entity.name]) {
            throw new Error(`Entity ${entity.name} already exists`);
        }
        return this._entities[entity.name] = entity;
    }
    addSequence(sequence) {
        if (this._sequencies[sequence.name]) {
            throw new Error(`Sequence ${sequence.name} already exists`);
        }
        return this._sequencies[sequence.name] = sequence;
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