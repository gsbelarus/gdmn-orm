import {AttributeAdapter} from '../../../rdbadapter';
import {IDateAttribute} from '../../../serialize';
import {ContextVariables} from '../../../types';
import {Attribute} from '../../Attribute';
import {INumberAttributeOptions, NumberAttribute} from './NumberAttribute';

export class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> {

  constructor(options: INumberAttributeOptions<Date, ContextVariables, AttributeAdapter>) {
    super(options);
  }

  public static isType(type: Attribute): type is TimeStampAttribute {
    return type instanceof TimeStampAttribute;
  }

  serialize(): IDateAttribute {
    return super.serialize();
  }
}
