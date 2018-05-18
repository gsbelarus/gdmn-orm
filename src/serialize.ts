import { LName, EnumValue } from './types';
import { ERModel, Entity, Attribute } from './ermodel';

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

export interface INumericAttribute<T> extends INumberAttribute<T> {
  precision: number;
  scale: number;
}

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

      e.attributes.forEach( attr => {
        let attribute: Attribute;

        switch (attr.type) {

          case 'EntityAttribute':

          case  'StringAttribute':
          case  'SetAttribute':
          case  'ParentAttribute':
          case  'SequenceAttribute':
          case  'IntegerAttribute':
          case  'NumericAttribute':
          case  'FloatAttribute':
          case  'BooleanAttribute':
          case  'DateAttribute':
          case  'TimeStampAttribute':
          case  'TimeAttribute':
          case  'BlobAttribute':
          case  'EnumAttribute'          :


          default:
            throw new Error(`Unknown attribyte type ${attr.type}`);
        }
      });
    }

    return result;
  };

  serialized.entities.forEach( e => createEntity(e) );

  return erModel;
}

