import { AttributeAdapter } from '../../rdbadapter';
import { ISequenceAttribute } from '../../serialize';
import { IBaseSemOptions } from '../../types';
import { Attribute } from '../Attribute';
import { Sequence } from '../Sequence';
import { ScalarAttribute } from './ScalarAttribute';
export interface ISequenceAttributeOptions<Adapter> extends IBaseSemOptions<Adapter> {
    sequence: Sequence;
}
export declare class SequenceAttribute extends ScalarAttribute<AttributeAdapter> {
    private readonly _sequence;
    constructor(options: ISequenceAttributeOptions<AttributeAdapter>);
    readonly sequence: Sequence;
    static isType(type: Attribute): type is SequenceAttribute;
    serialize(): ISequenceAttribute;
}
