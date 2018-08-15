import { IAttributeAdapter } from "../../../rdbadapter";
import { INumericAttribute } from "../../../serialize";
import { Attribute } from "../../Attribute";
import { INumberAttributeOptions, NumberAttribute } from "./NumberAttribute";
export interface INumericAttributeOptions<Adapter> extends INumberAttributeOptions<number, undefined, Adapter> {
    precision: number;
    scale: number;
}
export declare class NumericAttribute extends NumberAttribute<number> {
    private readonly _precision;
    private readonly _scale;
    constructor(options: INumericAttributeOptions<IAttributeAdapter>);
    readonly precision: number;
    readonly scale: number;
    static isType(type: Attribute): type is NumericAttribute;
    inspectDataType(): string;
    serialize(): INumericAttribute;
}
