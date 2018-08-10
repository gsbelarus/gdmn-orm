import { SetAttributeAdapter } from '../../rdbadapter';
import { ISetAttribute } from '../../serialize';
import { Attribute } from '../Attribute';
import { Attributes } from '../Entity';
import { EntityAttribute, IEntityAttributeOptions } from './EntityAttribute';
export interface ISetAttributeOptions extends IEntityAttributeOptions<SetAttributeAdapter> {
    presLen?: number;
}
export declare class SetAttribute extends EntityAttribute<SetAttributeAdapter> {
    private readonly _attributes;
    private readonly _presLen;
    constructor(options: ISetAttributeOptions);
    readonly attributes: Attributes;
    readonly presLen: number;
    static isType(type: Attribute): type is SetAttribute;
    attribute(name: string): Attribute | never;
    add<T extends Attribute>(attribute: T): T | never;
    serialize(): ISetAttribute;
    inspect(indent?: string): string[];
}
