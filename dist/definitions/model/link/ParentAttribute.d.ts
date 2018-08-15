import { IAttributeAdapter } from "../../rdbadapter";
import { IBaseSemOptions } from "../../types";
import { Attribute } from "../Attribute";
import { Entity } from "../Entity";
import { EntityAttribute } from "./EntityAttribute";
export interface IParentAttributeOptions extends IBaseSemOptions<IAttributeAdapter> {
    entities: Entity[];
}
export declare class ParentAttribute extends EntityAttribute {
    constructor(options: IParentAttributeOptions);
    static isType(type: Attribute): type is ParentAttribute;
}
