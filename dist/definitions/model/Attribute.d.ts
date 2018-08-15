import { SemCategory } from "gdmn-nlp";
import { IAttribute } from "../serialize";
import { IBaseSemOptions, ILName } from "../types";
export interface IAttributeOptions<Adapter> extends IBaseSemOptions<Adapter> {
    required?: boolean;
}
export declare abstract class Attribute<Adapter = any> {
    protected _adapter?: Adapter;
    private readonly _name;
    private readonly _lName;
    private readonly _required;
    private readonly _semCategories;
    protected constructor(options: IAttributeOptions<Adapter>);
    readonly adapter: Adapter | undefined;
    readonly name: string;
    readonly lName: ILName;
    readonly required: boolean;
    readonly semCategories: SemCategory[];
    serialize(): IAttribute;
    inspectDataType(): string;
    inspect(indent?: string): string[];
}
