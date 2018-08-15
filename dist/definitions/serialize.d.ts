import { ERModel } from "./model/ERModel";
import { ContextVariables, IEnumValue, ILName } from "./types";
export declare type AttributeClasses = "EntityAttribute" | "StringAttribute" | "SetAttribute" | "ParentAttribute" | "DetailAttribute" | "SequenceAttribute" | "IntegerAttribute" | "NumericAttribute" | "FloatAttribute" | "BooleanAttribute" | "DateAttribute" | "TimeStampAttribute" | "TimeAttribute" | "BlobAttribute" | "EnumAttribute";
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
export declare function deserializeERModel(serialized: IERModel): ERModel;
