import { IAttributeAdapter } from "../../rdbadapter";
import { Attribute, IAttributeOptions } from "../Attribute";
import { ScalarAttribute } from "./ScalarAttribute";
export declare class TimeIntervalAttribute extends ScalarAttribute {
    constructor(options: IAttributeOptions<IAttributeAdapter>);
    static isType(type: Attribute): type is TimeIntervalAttribute;
}
//# sourceMappingURL=TimeIntervalAttribute.d.ts.map