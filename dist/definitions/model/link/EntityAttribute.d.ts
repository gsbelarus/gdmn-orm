import { AttributeAdapter } from '../../rdbadapter';
import { IEntityAttribute } from '../../serialize';
import { Attribute, IAttributeOptions } from '../Attribute';
import { Entity } from '../Entity';
export interface IEntityAttributeOptions<Adapter = AttributeAdapter> extends IAttributeOptions<Adapter> {
    entities: Entity[];
}
export declare class EntityAttribute<Adapter = AttributeAdapter> extends Attribute<Adapter> {
    private readonly _entities;
    constructor(options: IEntityAttributeOptions<Adapter>);
    readonly entity: Entity[];
    static isType(type: Attribute): type is EntityAttribute<any>;
    serialize(): IEntityAttribute;
    inspectDataType(): string;
}
