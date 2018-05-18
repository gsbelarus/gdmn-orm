import { LName, EnumValue, ContextVariables } from './types';
import { ERModel, Entity, Attribute, EntityAttribute, StringAttribute, SetAttribute, SequenceAttribute, Sequence, IntegerAttribute, NumericAttribute, FloatAttribute, BooleanAttribute, DateAttribute, TimeStampAttribute, TimeAttribute, ParentAttribute, BlobAttribute, EnumAttribute, DetailAttribute } from './ermodel';

export type AttributeClasses = 'EntityAttribute'
  | 'StringAttribute'
  | 'SetAttribute'
  | 'ParentAttribute'
  | 'DetailAttribute'
  | 'SequenceAttribute'
  | 'IntegerAttribute'
  | 'NumericAttribute'
  | 'FloatAttribute'
  | 'BooleanAttribute'
  | 'DateAttribute'
  | 'TimeStampAttribute'
  | 'TimeAttribute'
  | 'BlobAttribute'
  | 'EnumAttribute';

export interface IAttribute {
  name: string;
  type: AttributeClasses;
  lName: LName;
  required: boolean;
  calculated: boolean;
}

export interface IEnumAttribute extends IAttribute {
  values: EnumValue[];
  defaultValue: string | number | undefined;
}

export interface IBooleanAttribute extends IAttribute {
  defaultValue: boolean;
}

export interface INumberAttribute<T, DF = undefined> extends IAttribute {
  minValue?: T;
  maxValue?: T;
  defaultValue?: T | DF;
}

export interface INumericAttribute extends INumberAttribute<number> {
  precision: number;
  scale: number;
}

export interface IDateAttribute extends INumberAttribute<Date, ContextVariables> { }

export interface ISequenceAttribute extends IAttribute {
  sequence: string;
}

export interface IStringAttribute extends IAttribute {
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  mask?: RegExp;
  autoTrim: boolean;
}

export interface IEntityAttribute extends IAttribute {
  references: string[];
}

export interface ISetAttribute extends IEntityAttribute {
  attributes: IAttribute[];
  presLen: number;
}

export interface IEntity {
  parent?: string;
  name: string;
  lName: LName;
  isAbstract: boolean;
  attributes: IAttribute[];
}

export interface IERModel {
  entities: IEntity[]
}

export function deserializeERModel(serialized: IERModel): ERModel {
  const erModel = new ERModel();

  const createSequence = (sequence: string): Sequence => {
    let result = erModel.sequencies[sequence];

    if (!result) {
      erModel.addSequence(result = new Sequence(sequence));
    }

    return result;
  }

  const createEntity = (e: IEntity): Entity => {
    let result = erModel.entities[e.name];

    if (!result) {
      let parent: Entity | undefined = undefined;

      if (e.parent) {
        const pe = serialized.entities.find( p => p.name === e.parent );

        if (!pe) {
          throw new Error(`Unknown entity ${e.parent}`);
        }

        parent = createEntity(pe);
      }

      erModel.add(result = new Entity(parent, e.name, e.lName, e.isAbstract));

      e.attributes.forEach( _attr => {
        const { name, lName, required, calculated } = _attr;

        switch (_attr.type) {

          case 'DetailAttribute':{
            const attr = _attr as IEntityAttribute;
            result.add(
              new DetailAttribute(name, lName, required,
                attr.references.map( e => erModel.entities[e] )
              )
            );
            break;
          }

          case 'ParentAttribute':{
            const attr = _attr as IEntityAttribute;
            result.add(
              new ParentAttribute(name, lName,
                attr.references.map( e => erModel.entities[e] )
              )
            );
            break;
          }

          case 'EntityAttribute': {
            const attr = _attr as IEntityAttribute;
            result.add(
              new EntityAttribute(name, lName, required,
                attr.references.map( e => erModel.entities[e] )
              )
            );
            break;
          }

          case 'StringAttribute': {
            const attr = _attr as IStringAttribute;
            result.add(
              new StringAttribute(name, lName, required, attr.minLength, attr.maxLength,
                attr.defaultValue, attr.autoTrim, attr.mask
              )
            );
            break;
          }

          case 'SetAttribute': {
            const attr = _attr as ISetAttribute;
            result.add(
              new SetAttribute(name, lName, required,
                attr.references.map( e => erModel.entities[e] ), attr.presLen
              )
            );
            break;
          }

          case 'SequenceAttribute': {
            const attr = _attr as ISequenceAttribute;
            result.add(
              new SequenceAttribute(name, lName, createSequence(attr.sequence))
            );
            break;
          }

          case 'IntegerAttribute': {
            const attr = _attr as INumberAttribute<number>;
            result.add(
              new IntegerAttribute(name, lName, required, attr.minValue, attr.maxValue,
                attr.defaultValue
              )
            );
            break;
          }

          case 'NumericAttribute': {
            const attr = _attr as INumericAttribute;
            result.add(
              new NumericAttribute(name, lName, required, attr.precision, attr.scale,
                attr.minValue, attr.maxValue, attr.defaultValue
              )
            );
            break;
          }

          case 'FloatAttribute': {
            const attr = _attr as INumberAttribute<number>;
            result.add(
              new FloatAttribute(name, lName, required, attr.minValue, attr.maxValue,
                attr.defaultValue
              )
            );
            break;
          }

          case 'BooleanAttribute': {
            const attr = _attr as IBooleanAttribute;
            result.add(
              new BooleanAttribute(name, lName, required, attr.defaultValue)
            );
            break;
          }

          case 'DateAttribute': {
            const attr = _attr as IDateAttribute;
            result.add(
              new DateAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue)
            );
            break;
          }

          case 'TimeStampAttribute': {
            const attr = _attr as IDateAttribute;
            result.add(
              new TimeStampAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue)
            );
            break;
          }

          case 'TimeAttribute': {
            const attr = _attr as IDateAttribute;
            result.add(
              new TimeAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue)
            );
            break;
          }

          case 'BlobAttribute': {
            result.add(
              new BlobAttribute(name, lName, required)
            );
            break;
          }

          case 'EnumAttribute': {
            const attr = _attr as IEnumAttribute;
            result.add(
              new EnumAttribute(name, lName, required, attr.values, attr.defaultValue)
            );
            break;
          }

          default:
            throw new Error(`Unknown attribyte type ${_attr.type}`);
        }
      });
    }

    return result;
  };

  serialized.entities.forEach( e => createEntity(e) );

  return erModel;
}

