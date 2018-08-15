import { IERModel } from "../serialize";
import { Entity } from "./Entity";
import { Sequence } from "./Sequence";
export interface IEntities {
    [name: string]: Entity;
}
export interface ISequencies {
    [name: string]: Sequence;
}
export declare class ERModel {
    private _entities;
    private _sequencies;
    readonly sequencies: ISequencies;
    readonly entities: IEntities;
    entity(name: string): Entity | never;
    add(entity: Entity): Entity | never;
    addSequence(sequence: Sequence): Sequence | never;
    serialize(): IERModel;
    inspect(): string[];
}
