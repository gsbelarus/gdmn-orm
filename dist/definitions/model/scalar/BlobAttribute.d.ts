import { AttributeAdapter } from '../../rdbadapter';
import { Attribute, IAttributeOptions } from '../Attribute';
import { ScalarAttribute } from './ScalarAttribute';
export declare class BlobAttribute extends ScalarAttribute {
    constructor(options: IAttributeOptions<AttributeAdapter>);
    static isType(type: Attribute): type is BlobAttribute;
}
