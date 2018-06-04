import { LName, EnumValue, ContextVariables } from './types';
import { ERModel, Entity, Attribute, EntityAttribute, StringAttribute, SetAttribute, SequenceAttribute, Sequence, IntegerAttribute, NumericAttribute, FloatAttribute, BooleanAttribute, DateAttribute, TimeStampAttribute, TimeAttribute, ParentAttribute, BlobAttribute, EnumAttribute, DetailAttribute } from './ermodel';
import { str2SemCategory, str2SemCategories } from 'gdmn-nlp';

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
  semCategories: string;
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
    }

    return result;
  };

  const createAttribute = (_attr: IAttribute): Attribute => {
    const { name, lName, required, calculated, semCategories } = _attr;
    const cat = str2SemCategories(_attr.semCategories);

    switch (_attr.type) {
      case 'DetailAttribute':{
        const attr = _attr as IEntityAttribute;
        return new DetailAttribute(name, lName, required,
          attr.references.map( e => erModel.entities[e] ),
          cat
        );
      }

      case 'ParentAttribute':{
        const attr = _attr as IEntityAttribute;
        return new ParentAttribute(name, lName,
          attr.references.map( e => erModel.entities[e] ),
          cat
        );
      }

      case 'EntityAttribute': {
        const attr = _attr as IEntityAttribute;
        return new EntityAttribute(name, lName, required,
          attr.references.map( e => erModel.entity(e) ),
          cat
        );
      }

      case 'StringAttribute': {
        const attr = _attr as IStringAttribute;
        return new StringAttribute(name, lName, required, attr.minLength, attr.maxLength,
            attr.defaultValue, attr.autoTrim, attr.mask, cat
        );
      }

      case 'SetAttribute': {
        const attr = _attr as ISetAttribute;
        const setAttribute = new SetAttribute(name, lName, required,
            attr.references.map( e => erModel.entities[e] ), attr.presLen, cat
        );
        attr.attributes.forEach( a => setAttribute.add(createAttribute(a)) );
        return setAttribute;
      }

      case 'SequenceAttribute': {
        const attr = _attr as ISequenceAttribute;
        return new SequenceAttribute(name, lName, createSequence(attr.sequence), cat);
      }

      case 'IntegerAttribute': {
        const attr = _attr as INumberAttribute<number>;
        return new IntegerAttribute(name, lName, required, attr.minValue, attr.maxValue,
            attr.defaultValue, cat
        );
      }

      case 'NumericAttribute': {
        const attr = _attr as INumericAttribute;
        return new NumericAttribute(name, lName, required, attr.precision, attr.scale,
            attr.minValue, attr.maxValue, attr.defaultValue, cat
        );
      }

      case 'FloatAttribute': {
        const attr = _attr as INumberAttribute<number>;
        return new FloatAttribute(name, lName, required, attr.minValue, attr.maxValue,
            attr.defaultValue, cat
        );
      }

      case 'BooleanAttribute': {
        const attr = _attr as IBooleanAttribute;
        return new BooleanAttribute(name, lName, required, attr.defaultValue, cat);
      }

      case 'DateAttribute': {
        const attr = _attr as IDateAttribute;
        return new DateAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue, cat);
      }

      case 'TimeStampAttribute': {
        const attr = _attr as IDateAttribute;
        return new TimeStampAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue, cat);
      }

      case 'TimeAttribute': {
        const attr = _attr as IDateAttribute;
        return new TimeAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue, cat);
      }

      case 'BlobAttribute': {
        return new BlobAttribute(name, lName, required, cat);
      }

      case 'EnumAttribute': {
        const attr = _attr as IEnumAttribute;
        return new EnumAttribute(name, lName, required, attr.values, attr.defaultValue, cat);
      }

      default:
        throw new Error(`Unknown attribyte type ${_attr.type}`);
    }
  }

  const createAttributes = (e: IEntity): void => {
    const entity = erModel.entity(e.name);
    e.attributes.forEach( _attr => entity.add(createAttribute(_attr)) );
  };

  serialized.entities.forEach( e => createEntity(e) );
  serialized.entities.forEach( e => createAttributes(e) );

  return erModel;
}

