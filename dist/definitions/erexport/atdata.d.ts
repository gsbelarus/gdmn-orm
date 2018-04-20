import { ATransaction } from 'gdmn-db';
import { LName } from '../types';
export interface atField {
    lName: LName;
}
export interface atFields {
    [fieldName: string]: atField;
}
export declare function load(transaction: ATransaction): Promise<{
    atfields: atFields;
}>;
