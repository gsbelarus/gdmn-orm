import { SemCategory } from "gdmn-nlp";
import { IEntityAdapter } from "../rdbadapter";
import { IEntity } from "../serialize";
import { IBaseSemOptions, IEntitySource, ILName, ITransaction } from "../types";
import { Attribute } from "./Attribute";
export interface IAttributes {
    [name: string]: Attribute;
}
export interface IEntityOptions extends IBaseSemOptions<IEntityAdapter> {
    parent?: Entity;
    isAbstract?: boolean;
}
export declare class Entity {
    private _source?;
    private readonly _parent?;
    private readonly _name;
    private readonly _lName;
    private readonly _isAbstract;
    private readonly _semCategories;
    private readonly _adapter?;
    private readonly _pk;
    private readonly _attributes;
    private readonly _unique;
    constructor(options: IEntityOptions);
    readonly pk: Attribute[];
    readonly parent: Entity | undefined;
    readonly lName: ILName;
    readonly name: string;
    readonly isAbstract: boolean;
    readonly adapter: IEntityAdapter;
    readonly unique: Attribute[][];
    readonly attributes: IAttributes;
    readonly ownAttributes: IAttributes;
    readonly semCategories: SemCategory[];
    readonly isTree: boolean;
    initDataSource(source?: IEntitySource): Promise<void>;
    attributesBySemCategory(cat: SemCategory): Attribute[];
    attribute(name: string): Attribute | never;
    ownAttribute(name: string): Attribute | never;
    hasAttribute(name: string): boolean;
    hasOwnAttribute(name: string): boolean;
    hasAncestor(a: Entity): boolean;
    add<T extends Attribute>(attribute: T): T | never;
    remove(attribute: Attribute): void;
    addUnique(value: Attribute[]): void;
    removeUnique(value: Attribute[]): void;
    addAttrUnique(attrs: Attribute[], transaction?: ITransaction): Promise<void>;
    removeAttrUnique(attrs: Attribute[], transaction?: ITransaction): Promise<void>;
    create<T extends Attribute>(attribute: T, transaction?: ITransaction): Promise<T>;
    delete(attribute: Attribute, transaction: ITransaction): Promise<void>;
    serialize(): IEntity;
    inspect(): string[];
    private _checkTransaction;
}
