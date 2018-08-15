import { ISequenceAdapter } from "../rdbadapter";
import { IBaseOptions } from "../types";
export declare class Sequence<Adapter = ISequenceAdapter> {
    private readonly _name;
    private readonly _adapter?;
    constructor(options: IBaseOptions<Adapter>);
    readonly name: string;
    readonly adapter: Adapter | undefined;
}
