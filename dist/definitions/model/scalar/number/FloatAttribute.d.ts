import { IAttributeAdapter } from "../../../rdbadapter";
import { Attribute } from "../../Attribute";
import { INumberAttributeOptions, NumberAttribute } from "./NumberAttribute";
export declare class FloatAttribute extends NumberAttribute<number> {
    constructor(options: INumberAttributeOptions<number, undefined, IAttributeAdapter>);
    static isType(type: Attribute): type is FloatAttribute;
}
