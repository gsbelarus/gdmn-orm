import { IAttributeAdapter } from "../../rdbadapter";
import { IEnumAttribute } from "../../serialize";
import { IEnumValue } from "../../types";
import { Attribute, IAttributeOptions } from "../Attribute";
import { ScalarAttribute } from "./ScalarAttribute";
export interface IEnumAttributeOptions extends IAttributeOptions<IAttributeAdapter> {
    values: IEnumValue[];
    defaultValue?: string | number;
}
export declare class EnumAttribute extends ScalarAttribute {
    private readonly _values;
    private readonly _defaultValue?;
    constructor(options: IEnumAttributeOptions);
    readonly values: IEnumValue[];
    readonly defaultValue: string | number | undefined;
    static isType(type: Attribute): type is EnumAttribute;
    inspectDataType(): string;
    serialize(): IEnumAttribute;
}
