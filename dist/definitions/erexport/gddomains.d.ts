import * as erm from '../ermodel';
import { LName } from '../types';
import { Attribute2FieldMap } from '../rdbadapter';
export declare type createDomainFunc = (attributeName: string, lName: LName, adapter?: Attribute2FieldMap) => erm.Attribute;
export declare const gdDomains: {
    [name: string]: createDomainFunc;
};
