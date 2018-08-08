import {AttributeAdapter} from '../../rdbadapter';
import {Attribute, IAttributeOptions} from '../Attribute';
import {ScalarAttribute} from './ScalarAttribute';

export class TimeIntervalAttribute extends ScalarAttribute {

  constructor(options: IAttributeOptions<AttributeAdapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is TimeIntervalAttribute {
    return type instanceof TimeIntervalAttribute;
  }
}
