import {DetailAttributeAdapter} from '../../rdbadapter';
import {Attribute} from '../Attribute';
import {EntityAttribute, IEntityAttributeOptions} from './EntityAttribute';

export class DetailAttribute extends EntityAttribute<DetailAttributeAdapter> {

  constructor(options: IEntityAttributeOptions<DetailAttributeAdapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is DetailAttribute {
    return type instanceof DetailAttribute;
  }
}
