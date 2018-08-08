import {AttributeAdapter} from '../../../rdbadapter';
import {IDateAttribute} from '../../../serialize';
import {ContextVariables} from '../../../types';
import {Attribute} from '../../Attribute';
import {INumberAttributeOptions, NumberAttribute} from './NumberAttribute';

export class TimeAttribute extends NumberAttribute<Date, ContextVariables> {

  constructor(options: INumberAttributeOptions<Date, ContextVariables, AttributeAdapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is TimeAttribute {
    return type instanceof TimeAttribute;
  }

  serialize(): IDateAttribute {
    return super.serialize();
  }
}
