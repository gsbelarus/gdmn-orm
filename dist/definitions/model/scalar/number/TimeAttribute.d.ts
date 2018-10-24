import { IAttributeAdapter } from "../../../rdbadapter";
import { IDateAttribute } from "../../../serialize";
import { ContextVariables } from "../../../types";
import { Attribute } from "../../Attribute";
import { INumberAttributeOptions, NumberAttribute } from "./NumberAttribute";
export declare class TimeAttribute extends NumberAttribute<Date, ContextVariables> {
    constructor(options: INumberAttributeOptions<Date, ContextVariables, IAttributeAdapter>);
    static isType(type: Attribute): type is TimeAttribute;
    serialize(): IDateAttribute;
}
//# sourceMappingURL=TimeAttribute.d.ts.map