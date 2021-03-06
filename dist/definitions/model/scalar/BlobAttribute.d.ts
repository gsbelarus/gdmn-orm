import { IAttributeAdapter } from "../../rdbadapter";
import { Attribute, IAttributeOptions } from "../Attribute";
import { ScalarAttribute } from "./ScalarAttribute";
export declare class BlobAttribute extends ScalarAttribute {
    constructor(options: IAttributeOptions<IAttributeAdapter>);
    static isType(type: Attribute): type is BlobAttribute;
}
//# sourceMappingURL=BlobAttribute.d.ts.map