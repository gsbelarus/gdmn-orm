import { AttributeAdapter } from '../../../rdbadapter';
import { INumberAttribute } from '../../../serialize';
import { IBaseSemOptions } from '../../../types';
import { Attribute } from '../../Attribute';
import { ScalarAttribute } from '../ScalarAttribute';
export interface INumberAttributeOptions<T, DF = undefined, Adapter = AttributeAdapter> extends IBaseSemOptions<Adapter> {
    minValue?: T;
    maxValue?: T;
    defaultValue?: T | DF;
    required?: boolean;
}
export declare abstract class NumberAttribute<T, DF = undefined, Adapter = AttributeAdapter> extends ScalarAttribute<Adapter> {
    private readonly _minValue?;
    private readonly _maxValue?;
    private readonly _defaultValue?;
    protected constructor(options: INumberAttributeOptions<T, DF, Adapter>);
    readonly minValue: T | undefined;
    readonly maxValue: T | undefined;
    readonly defaultValue: T | DF | undefined;
    static isType(type: Attribute): type is NumberAttribute<any>;
    serialize(): INumberAttribute<T, DF>;
}
