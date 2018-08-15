import { IAttributeAdapter } from "../../rdbadapter";
import { IEntityAttribute } from "../../serialize";
import { Attribute, IAttributeOptions } from "../Attribute";
import { Entity } from "../Entity";
export interface IEntityAttributeOptions<Adapter = IAttributeAdapter> extends IAttributeOptions<Adapter> {
    entities: Entity[];
}
export declare class EntityAttribute<Adapter = IAttributeAdapter> extends Attribute<Adapter> {
    private readonly _entities;
    constructor(options: IEntityAttributeOptions<Adapter>);
    readonly entities: Entity[];
    static isType(type: Attribute): type is EntityAttribute<any>;
    serialize(): IEntityAttribute;
    inspectDataType(): string;
}
