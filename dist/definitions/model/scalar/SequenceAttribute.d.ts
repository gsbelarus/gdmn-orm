import { IAttributeAdapter } from "../../rdbadapter";
import { ISequenceAttribute } from "../../serialize";
import { IBaseSemOptions } from "../../types";
import { Attribute } from "../Attribute";
import { Sequence } from "../Sequence";
import { ScalarAttribute } from "./ScalarAttribute";
export interface ISequenceAttributeOptions<Adapter> extends IBaseSemOptions<Adapter> {
    sequence: Sequence;
}
export declare class SequenceAttribute extends ScalarAttribute<IAttributeAdapter> {
    private readonly _sequence;
    constructor(options: ISequenceAttributeOptions<IAttributeAdapter>);
    readonly sequence: Sequence;
    static isType(type: Attribute): type is SequenceAttribute;
    serialize(): ISequenceAttribute;
}
