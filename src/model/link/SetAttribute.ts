import {SetAttributeAdapter} from '../../rdbadapter';
import {ISetAttribute} from '../../serialize';
import {Attribute} from '../Attribute';
import {Attributes} from '../Entity';
import {EntityAttribute, IEntityAttributeOptions} from './EntityAttribute';

export interface ISetAttributeOptions extends IEntityAttributeOptions<SetAttributeAdapter> {
  presLen?: number;
}

export class SetAttribute extends EntityAttribute<SetAttributeAdapter> {

  private readonly _attributes: Attributes = {};
  private readonly _presLen: number;

  constructor(options: ISetAttributeOptions) {
    super(options);
    this._presLen = options.presLen || 0;
  }

  get attributes(): Attributes {
    return this._attributes;
  }

  get presLen(): number {
    return this._presLen;
  }

  public static isType(type: Attribute): type is SetAttribute {
    return type instanceof SetAttribute;
  }

  attribute(name: string): Attribute | never {
    const found = this._attributes[name];
    if (!found) {
      throw new Error(`Unknown attribute ${name}`);
    }
    return found;
  }

  add(attribute: Attribute): Attribute | never {
    if (this._attributes[attribute.name]) {
      throw new Error(`Attribute ${attribute.name} already exists`);
    }

    return this._attributes[attribute.name] = attribute;
  }

  serialize(): ISetAttribute {
    return {
      ...super.serialize(),
      attributes: Object.entries(this._attributes).map(a => a[1].serialize()),
      presLen: this._presLen
    };
  }

  inspect(indent: string = '    '): string[] {
    const result = super.inspect();
    return [...result,
      ...Object.entries(this._attributes).reduce((p, a) => {
        return [...p, ...a[1].inspect(indent + '  ')];
      }, [] as string[])
    ];
  }
}
