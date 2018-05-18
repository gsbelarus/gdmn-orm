import { LName, EnumValue } from './types';
import { ERModel } from './ermodel';
export declare type AttributeClasses = 'EntityAttribute' | 'StringAttribute' | 'SetAttribute' | 'ParentAttribute' | 'DetailAttribute' | 'SequenceAttribute' | 'IntegerAttribute' | 'NumericAttribute' | 'FloatAttribute' | 'BooleanAttribute' | 'DateAttribute' | 'TimeStampAttribute' | 'TimeAttribute' | 'BlobAttribute' | 'EnumAttribute';
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
    entities: IEntity[];
}
export declare function loadERModel(serialized: IERModel): ERModel;
