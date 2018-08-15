import { IAttributeAdapter } from "../../rdbadapter";
import { IStringAttribute } from "../../serialize";
import { Attribute, IAttributeOptions } from "../Attribute";
import { ScalarAttribute } from "./ScalarAttribute";
export interface IStringAttributeOptions extends IAttributeOptions<IAttributeAdapter> {
    minLength?: number;
    maxLength?: number;
    defaultValue?: string;
    mask?: RegExp;
    autoTrim?: boolean;
}
export declare class StringAttribute extends ScalarAttribute {
    private readonly _minLength?;
    private readonly _maxLength?;
    private readonly _defaultValue?;
    private readonly _mask?;
    private readonly _autoTrim;
    constructor(options: IStringAttributeOptions);
    readonly minLength: number | undefined;
    readonly maxLength: number | undefined;
    readonly defaultValue: string | undefined;
    readonly mask: RegExp | undefined;
    readonly autoTrim: boolean;
    static isType(type: Attribute): type is StringAttribute;
    serialize(): IStringAttribute;
    inspectDataType(): string;
}
