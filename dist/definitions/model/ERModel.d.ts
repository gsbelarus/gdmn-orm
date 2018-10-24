import { IEntityQueryInspector, IQueryResponse } from "../query-models/EntityQuery";
import { IERModel } from "../serialize";
import { IDataSource, ITransaction } from "../types";
import { Entity } from "./Entity";
import { Sequence } from "./Sequence";
export interface IEntities {
    [name: string]: Entity;
}
export interface ISequencies {
    [name: string]: Sequence;
}
export declare class ERModel {
    private _source?;
    private _entities;
    private _sequencies;
    readonly sequencies: ISequencies;
    readonly entities: IEntities;
    initDataSource(source?: IDataSource): Promise<void>;
    entity(name: string): Entity | never;
    sequence(name: string): Sequence;
    hasEntity(name: string): boolean;
    hasSequence(name: string): boolean;
    add(entity: Entity): Entity;
    remove(entity: Entity): void;
    addSequence(sequence: Sequence): Sequence | never;
    removeSequence(sequence: Sequence): void;
    has(sequence: Sequence): boolean;
    has(entity: Entity): boolean;
    create(sequence: Sequence, transaction?: ITransaction): Promise<Sequence>;
    create(entity: Entity, transaction?: ITransaction): Promise<Entity>;
    delete(sequence: Sequence, transaction?: ITransaction): Promise<void>;
    delete(entity: Entity, transaction?: ITransaction): Promise<void>;
    query(query: IEntityQueryInspector, transaction?: ITransaction): Promise<IQueryResponse>;
    startTransaction(): Promise<ITransaction>;
    serialize(): IERModel;
    inspect(): string[];
    private _checkTransaction;
}
//# sourceMappingURL=ERModel.d.ts.map