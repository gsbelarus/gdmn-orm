export interface TName {
    name: string;
    fullName?: string;
}
export interface LName {
    ru?: TName;
    by?: TName;
    en?: TName;
}
export interface EnumValue {
    value: string | number;
    lName?: LName;
}
export declare type ContextVariables = 'CURRENT_TIMESTAMP' | 'CURRENT_TIMESTAMP(0)' | 'CURRENT_DATE' | 'CURRENT_TIME';
