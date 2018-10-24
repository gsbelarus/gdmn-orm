import { ISequenceAdapter } from "../rdbadapter";
import { IBaseOptions, ISequenceSource } from "../types";
export declare class Sequence<Adapter = ISequenceAdapter> {
    protected _source?: ISequenceSource;
    private readonly _name;
    private readonly _adapter?;
    constructor(options: IBaseOptions<Adapter>);
    readonly name: string;
    readonly adapter: Adapter | undefined;
    initDataSource(source?: ISequenceSource): Promise<void>;
}
//# sourceMappingURL=Sequence.d.ts.map