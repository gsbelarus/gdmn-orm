import { IAttributeAdapter } from "../../rdbadapter";
import { Attribute, IAttributeOptions } from "../Attribute";
export declare abstract class ScalarAttribute<Adapter = IAttributeAdapter> extends Attribute<Adapter> {
    protected constructor(options: IAttributeOptions<Adapter>);
    static isType(type: Attribute): type is ScalarAttribute;
}
