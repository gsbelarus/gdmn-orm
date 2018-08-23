import { SemCategory } from "gdmn-nlp";
import { Attribute } from "./model/Attribute";
import { Entity } from "./model/Entity";
import { ERModel } from "./model/ERModel";
import { Sequence } from "./model/Sequence";
export interface ITName {
    name: string;
    fullName?: string;
}
export interface ILName {
    ru?: ITName;
    by?: ITName;
    en?: ITName;
}
export interface IEnumValue {
    value: string | number;
    lName?: ILName;
}
export declare type ContextVariables = "CURRENT_TIMESTAMP" | "CURRENT_TIMESTAMP(0)" | "CURRENT_DATE" | "CURRENT_TIME";
export interface IBaseOptions<Adapter = any> {
    name: string;
    adapter?: Adapter;
    [name: string]: any;
}
export interface IBaseSemOptions<Adapter = any> extends IBaseOptions<Adapter> {
    lName: ILName;
    semCategories?: SemCategory[];
}
export interface ITransaction {
    finished: boolean;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
export interface IBaseSource<CurType> {
    init(obj: CurType): Promise<CurType>;
}
export interface IBaseCreatableSource<ParentType, CurType> extends IBaseSource<CurType> {
    create<T extends CurType>(transaction: ITransaction, parent: ParentType, obj: T): Promise<T>;
    delete(transaction: ITransaction, parent: ParentType, obj: CurType): Promise<void>;
}
export interface IDataSource extends IBaseSource<ERModel> {
    startTransaction(): Promise<ITransaction>;
    getEntitySource(): IEntitySource | undefined;
    getSequenceSource(): ISequenceSource | undefined;
}
export interface ISequenceSource extends IBaseCreatableSource<ERModel, Sequence<any>> {
}
export interface IEntitySource extends IBaseCreatableSource<ERModel, Entity> {
    getAttributeSource(): IAttributeSource | undefined;
    addUnique(transaction: ITransaction, entity: Entity, attrs: Attribute[]): Promise<void>;
    removeUnique(transaction: ITransaction, entity: Entity, attrs: Attribute[]): Promise<void>;
}
export interface IAttributeSource extends IBaseCreatableSource<Entity, Attribute> {
}
