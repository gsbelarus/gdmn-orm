import { IDetailAttributeAdapter } from "../../rdbadapter";
import { Attribute } from "../Attribute";
import { EntityAttribute, IEntityAttributeOptions } from "./EntityAttribute";
export declare class DetailAttribute extends EntityAttribute<IDetailAttributeAdapter> {
    constructor(options: IEntityAttributeOptions<IDetailAttributeAdapter>);
    static isType(type: Attribute): type is DetailAttribute;
}
//# sourceMappingURL=DetailAttribute.d.ts.map