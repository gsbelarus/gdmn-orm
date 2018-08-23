import { ITransaction } from "../types";
export declare class DefaultTransaction implements ITransaction {
    finished: boolean;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
