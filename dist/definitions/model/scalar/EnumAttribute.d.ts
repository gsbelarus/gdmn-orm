import { AttributeAdapter } from '../../rdbadapter';
import { IEnumAttribute } from '../../serialize';
import { EnumValue } from '../../types';
import { Attribute, IAttributeOptions } from '../Attribute';
import { ScalarAttribute } from './ScalarAttribute';
export interface IEnumAttributeOptions extends IAttributeOptions<AttributeAdapter> {
    values: EnumValue[];
    defaultValue?: string | number;
}
export declare class EnumAttribute extends ScalarAttribute {
    private readonly _values;
    private readonly _defaultValue?;
    constructor(options: IEnumAttributeOptions);
    readonly values: EnumValue[];
    readonly defaultValue: string | number | undefined;
    static isType(type: Attribute): type is EnumAttribute;
    inspectDataType(): string;
    serialize(): IEnumAttribute;
}
