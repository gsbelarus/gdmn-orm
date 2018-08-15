import { SemCategory } from "gdmn-nlp";
import { IEntityAdapter } from "../rdbadapter";
import { IEntity } from "../serialize";
import { IBaseSemOptions, ILName } from "../types";
import { Attribute } from "./Attribute";
export interface IAttributes {
    [name: string]: Attribute;
}
export interface IEntityOptions extends IBaseSemOptions<IEntityAdapter> {
    parent?: Entity;
    isAbstract?: boolean;
}
export declare class Entity {
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
    addUnique(value: Attribute[]): void;
    hasAttribute(name: string): boolean;
    hasOwnAttribute(name: string): boolean;
    attribute(name: string): Attribute | never;
    ownAttribute(name: string): Attribute | never;
    attributesBySemCategory(cat: SemCategory): Attribute[];
    add<T extends Attribute>(attribute: T): T | never;
    hasAncestor(a: Entity): boolean;
    serialize(): IEntity;
    inspect(): string[];
}
