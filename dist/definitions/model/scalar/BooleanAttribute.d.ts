import { IAttributeAdapter } from "../../rdbadapter";
import { IBooleanAttribute } from "../../serialize";
import { Attribute, IAttributeOptions } from "../Attribute";
import { ScalarAttribute } from "./ScalarAttribute";
export interface IBooleanAttributeOptions extends IAttributeOptions<IAttributeAdapter> {
    defaultValue?: boolean;
}
export declare class BooleanAttribute extends ScalarAttribute {
    private readonly _defaultValue;
    constructor(options: IBooleanAttributeOptions);
    readonly defaultValue: boolean;
    static isType(type: Attribute): type is BooleanAttribute;
    serialize(): IBooleanAttribute;
}
//# sourceMappingURL=BooleanAttribute.d.ts.map