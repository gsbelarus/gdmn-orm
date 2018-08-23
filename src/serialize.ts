import {str2SemCategories} from "gdmn-nlp";
import {Attribute} from "./model/Attribute";
import {Entity} from "./model/Entity";
import {ERModel} from "./model/ERModel";
import {DetailAttribute} from "./model/link/DetailAttribute";
import {EntityAttribute} from "./model/link/EntityAttribute";
import {ParentAttribute} from "./model/link/ParentAttribute";
import {SetAttribute} from "./model/link/SetAttribute";
import {BlobAttribute} from "./model/scalar/BlobAttribute";
import {BooleanAttribute} from "./model/scalar/BooleanAttribute";
import {EnumAttribute} from "./model/scalar/EnumAttribute";
import {DateAttribute} from "./model/scalar/number/DateAttribute";
import {FloatAttribute} from "./model/scalar/number/FloatAttribute";
import {IntegerAttribute} from "./model/scalar/number/IntegerAttribute";
import {NumericAttribute} from "./model/scalar/number/NumericAttribute";
import {TimeAttribute} from "./model/scalar/number/TimeAttribute";
import {TimeStampAttribute} from "./model/scalar/number/TimeStampAttribute";
import {SequenceAttribute} from "./model/scalar/SequenceAttribute";
import {StringAttribute} from "./model/scalar/StringAttribute";
import {Sequence} from "./model/Sequence";
import {ContextVariables, IEnumValue, ILName} from "./types";

export type AttributeClasses = "EntityAttribute"
  | "StringAttribute"
  | "SetAttribute"
  | "ParentAttribute"
  | "DetailAttribute"
  | "SequenceAttribute"
  | "IntegerAttribute"
  | "NumericAttribute"
  | "FloatAttribute"
  | "BooleanAttribute"
  | "DateAttribute"
  | "TimeStampAttribute"
  | "TimeAttribute"
  | "BlobAttribute"
  | "EnumAttribute";

export interface IAttribute {
  name: string;
  type: AttributeClasses;
  lName: ILName;
  required: boolean;
  semCategories: string;
}

export interface IEnumAttribute extends IAttribute {
  values: IEnumValue[];
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

export interface IDateAttribute extends INumberAttribute<Date, ContextVariables> {
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

// TODO unique
export interface IEntity {
  parent?: string;
  name: string;
  lName: ILName;
  isAbstract: boolean;
  semCategories: string;
  attributes: IAttribute[];
}

export interface IERModel {
  entities: IEntity[];
}

export function deserializeERModel(serialized: IERModel): ERModel {
  const erModel = new ERModel();

  const createSequence = (sequence: string): Sequence => {
    let result = erModel.sequencies[sequence];

    if (!result) {
      erModel.addSequence(result = new Sequence({name: sequence}));
    }

    return result;
  };

  const createEntity = (e: IEntity): Entity => {
    let result = erModel.entities[e.name];

    if (!result) {
      let parent: Entity | undefined;

      if (e.parent) {
        const pe = serialized.entities.find((p) => p.name === e.parent);

        if (!pe) {
          throw new Error(`Unknown entity ${e.parent}`);
        }

        parent = createEntity(pe);
      }
      erModel.add(
        result = new Entity({
          name: e.name,
          lName: e.lName,
          parent,
          isAbstract: e.isAbstract,
          semCategories: str2SemCategories(e.semCategories)
        })
      );
    }

    return result;
  };

  const createAttribute = (_attr: IAttribute): Attribute => {
    const {name, lName, required} = _attr;
    const semCategories = str2SemCategories(_attr.semCategories);

    switch (_attr.type) {
      case "DetailAttribute": {
        const attr = _attr as IEntityAttribute;
        const entities = attr.references.map((e) => erModel.entities[e]);
        return new DetailAttribute({name, lName, required, entities, semCategories});
      }

      case "ParentAttribute": {
        const attr = _attr as IEntityAttribute;
        const entities = attr.references.map((e) => erModel.entities[e]);
        return new ParentAttribute({name, lName, entities, semCategories});
      }

      case "EntityAttribute": {
        const attr = _attr as IEntityAttribute;
        const entities = attr.references.map((e) => erModel.entity(e));
        return new EntityAttribute({name, lName, required, entities, semCategories});
      }

      case "StringAttribute": {
        const {minLength, maxLength, defaultValue, autoTrim, mask} = _attr as IStringAttribute;
        return new StringAttribute({
          name, lName, required, minLength, maxLength, defaultValue, autoTrim, mask, semCategories
        });
      }

      case "SetAttribute": {
        const attr = _attr as ISetAttribute;
        const entities = attr.references.map((e) => erModel.entities[e]);
        const setAttribute = new SetAttribute({name, lName, required, entities, semCategories});
        attr.attributes.forEach((a) => setAttribute.add(createAttribute(a)));
        return setAttribute;
      }

      case "SequenceAttribute": {
        const attr = _attr as ISequenceAttribute;
        return new SequenceAttribute({name, lName, sequence: createSequence(attr.sequence), semCategories});
      }

      case "IntegerAttribute": {
        const {minValue, maxValue, defaultValue} = _attr as INumberAttribute<number>;
        return new IntegerAttribute({name, lName, required, minValue, maxValue, defaultValue, semCategories});
      }

      case "NumericAttribute": {
        const {precision, scale, minValue, maxValue, defaultValue} = _attr as INumericAttribute;
        return new NumericAttribute({
          name, lName, required, precision, scale, minValue, maxValue, defaultValue, semCategories
        });
      }

      case "FloatAttribute": {
        const {minValue, maxValue, defaultValue} = _attr as INumberAttribute<number>;
        return new FloatAttribute({name, lName, required, minValue, maxValue, defaultValue, semCategories});
      }

      case "BooleanAttribute": {
        const {defaultValue} = _attr as IBooleanAttribute;
        return new BooleanAttribute({name, lName, required, defaultValue, semCategories});
      }

      case "DateAttribute": {
        const {minValue, maxValue, defaultValue} = _attr as IDateAttribute;
        return new DateAttribute({name, lName, required, minValue, maxValue, defaultValue, semCategories});
      }

      case "TimeStampAttribute": {
        const {minValue, maxValue, defaultValue} = _attr as IDateAttribute;
        return new TimeStampAttribute({name, lName, required, minValue, maxValue, defaultValue, semCategories});
      }

      case "TimeAttribute": {
        const {minValue, maxValue, defaultValue} = _attr as IDateAttribute;
        return new TimeAttribute({name, lName, required, minValue, maxValue, defaultValue, semCategories});
      }

      case "BlobAttribute": {
        return new BlobAttribute({name, lName, required, semCategories});
      }

      case "EnumAttribute": {
        const {values, defaultValue} = _attr as IEnumAttribute;
        return new EnumAttribute({name, lName, required, values, defaultValue, semCategories});
      }

      default:
        throw new Error(`Unknown attribyte type ${_attr.type}`);
    }
  };

  const createAttributes = (e: IEntity): void => {
    const entity = erModel.entity(e.name);
    e.attributes.forEach((_attr) => entity.add(createAttribute(_attr)));
  };

  serialized.entities.forEach((e) => createEntity(e));
  serialized.entities.forEach((e) => createAttributes(e));

  return erModel;
}
