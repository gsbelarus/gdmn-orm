import {AttributeAdapter} from '../../rdbadapter';
import {Attribute, IAttributeOptions} from '../Attribute';

export abstract class ScalarAttribute<Adapter = AttributeAdapter> extends Attribute<Adapter> {

  protected constructor(options: IAttributeOptions<Adapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is ScalarAttribute {
    return type instanceof ScalarAttribute;
  }
}
