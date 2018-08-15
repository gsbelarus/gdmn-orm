import { ISetAttributeAdapter } from "../../rdbadapter";
import { ISetAttribute } from "../../serialize";
import { Attribute } from "../Attribute";
import { IAttributes } from "../Entity";
import { EntityAttribute, IEntityAttributeOptions } from "./EntityAttribute";
export interface ISetAttributeOptions extends IEntityAttributeOptions<ISetAttributeAdapter> {
    presLen?: number;
}
export declare class SetAttribute extends EntityAttribute<ISetAttributeAdapter> {
    private readonly _attributes;
    private readonly _presLen;
    constructor(options: ISetAttributeOptions);
    readonly attributes: IAttributes;
    readonly presLen: number;
    static isType(type: Attribute): type is SetAttribute;
    attribute(name: string): Attribute | never;
    add<T extends Attribute>(attribute: T): T | never;
    serialize(): ISetAttribute;
    inspect(indent?: string): string[];
}
