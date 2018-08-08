import {AttributeAdapter} from '../../rdbadapter';
import {Attribute, IAttributeOptions} from '../Attribute';
import {ScalarAttribute} from './ScalarAttribute';

export class BlobAttribute extends ScalarAttribute {

  constructor(options: IAttributeOptions<AttributeAdapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is BlobAttribute {
    return type instanceof BlobAttribute;
  }
}
