import {AttributeAdapter} from '../../rdbadapter';
import {IBaseSemOptions} from '../../types';
import {Attribute} from '../Attribute';
import {Entity} from '../Entity';
import {EntityAttribute} from './EntityAttribute';

export interface IParentAttributeOptions extends IBaseSemOptions<AttributeAdapter> {
  entities: Entity[];
}

export class ParentAttribute extends EntityAttribute {

  constructor(options: IParentAttributeOptions) {
    super(options);
  }

  public static isType(type: Attribute): type is ParentAttribute {
    return type instanceof ParentAttribute;
  }
}
