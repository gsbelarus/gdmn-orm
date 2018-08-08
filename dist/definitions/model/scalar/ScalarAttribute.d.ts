import { AttributeAdapter } from '../../rdbadapter';
import { Attribute, IAttributeOptions } from '../Attribute';
export declare abstract class ScalarAttribute<Adapter = AttributeAdapter> extends Attribute<Adapter> {
    protected constructor(options: IAttributeOptions<Adapter>);
    static isType(type: Attribute): type is ScalarAttribute;
}
