/**
 *
 */
import { LName, AttributeAdapter, SequenceAdapter } from './types';
import { IEntity, IAttribute, IERModel } from './interfaces';
import { Entity2RelationMap } from './rdbadapter';
export declare type ContextVariables = 'CURRENT_TIMESTAMP' | 'CURRENT_TIMESTAMP(0)' | 'CURRENT_DATE' | 'CURRENT_TIME';
export declare class Attribute {
    private _name;
    private _lName;
    private _required;
    private _calculated;
    readonly adapter?: AttributeAdapter;
    constructor(name: string, lName: LName, required: boolean, adapter?: AttributeAdapter);
    readonly name: string;
    readonly lName: LName;
    readonly required: boolean;
    readonly calculated: boolean;
    serialize(): IAttribute;
    inspect(): string[];
}
export interface Attributes {
    [name: string]: Attribute;
}
export declare class ScalarAttribute extends Attribute {
}
export declare class StringAttribute extends ScalarAttribute {
    private _minLength?;
    private _maxLength?;
    private _defaultValue?;
    private _mask?;
    private _autoTrim;
    constructor(name: string, lName: LName, required: boolean, minLength: number | undefined, maxLength: number | undefined, defaultValue: string | undefined, autoTrim: boolean, mask: RegExp | undefined, adapter?: AttributeAdapter);
}
export declare class SequenceAttribute extends ScalarAttribute {
    private _sequence;
    constructor(name: string, lName: LName, sequence: Sequence, adapter?: AttributeAdapter);
}
export declare class NumberAttribute<T, DF = undefined> extends ScalarAttribute {
    private _minValue?;
    private _maxValue?;
    private _defaultValue?;
    constructor(name: string, lName: LName, required: boolean, minValue: T | undefined, maxValue: T | undefined, defaultValue: T | undefined | DF, adapter?: AttributeAdapter);
    minValue: T | undefined;
    maxValue: T | undefined;
    defaultValue: T | DF | undefined;
}
export declare class IntegerAttribute extends NumberAttribute<number> {
}
export declare class FloatAttribute extends NumberAttribute<number> {
}
export declare class NumericAttribute extends NumberAttribute<number> {
    private _precision;
    private _scale;
    constructor(name: string, lName: LName, required: boolean, precision: number, scale: number, minValue: number | undefined, maxValue: number | undefined, defaultValue: number | undefined, adapter?: AttributeAdapter);
}
export declare class DateAttribute extends NumberAttribute<Date, ContextVariables> {
}
export declare class TimeAttribute extends NumberAttribute<Date, ContextVariables> {
}
export declare class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> {
}
export declare class BooleanAttribute extends ScalarAttribute {
    private _defaultValue;
    constructor(name: string, lName: LName, required: boolean, defaultValue: boolean, adapter?: AttributeAdapter);
    defaultValue: boolean;
}
export declare class BLOBAttribute extends ScalarAttribute {
}
export interface EnumValue {
    value: string | number;
    lName?: LName;
}
export declare class EnumAttribute extends ScalarAttribute {
    private _values;
    private _defaultValue;
    constructor(name: string, lName: LName, required: boolean, values: EnumValue[], defaultValue: string | number | undefined, adapter?: AttributeAdapter);
    values: EnumValue[];
    defaultValue: string | number | undefined;
}
export declare class TimeIntervalAttribute extends ScalarAttribute {
}
export declare class EntityAttribute extends Attribute {
    private _entity;
    constructor(name: string, lName: LName, required: boolean, entity: Entity[], adapter?: AttributeAdapter);
    readonly entity: Entity[];
    serialize(): IAttribute;
}
export declare class ParentAttribute extends EntityAttribute {
    constructor(name: string, lName: LName, entity: Entity[], adapter?: AttributeAdapter);
}
export declare class DetailAttribute extends EntityAttribute {
}
export declare class SetAttribute extends EntityAttribute {
    private _attributes;
    attribute(name: string): Attribute;
    add(attribute: Attribute): Attribute;
    readonly attributes: Attributes;
    serialize(): IAttribute;
}
export declare class Entity {
    readonly parent?: Entity;
    readonly name: string;
    readonly lName: LName;
    readonly isAbstract: boolean;
    private _adapter?;
    private _pk;
    private _attributes;
    private _unique;
    constructor(parent: Entity | undefined, name: string, lName: LName, isAbstract: boolean, adapter?: Entity2RelationMap);
    readonly pk: Attribute[];
    readonly adapter: Entity2RelationMap;
    readonly unique: Attribute[][];
    addUnique(value: Attribute[]): void;
    readonly attributes: Attributes;
    hasAttribute(name: string): boolean;
    hasOwnAttribute(name: string): boolean;
    attribute(name: string): Attribute;
    add(attribute: Attribute): Attribute;
    hasAncestor(a: Entity): boolean;
    serialize(): IEntity;
    inspect(): string[];
}
export interface Entities {
    [name: string]: Entity;
}
export declare class Sequence {
    private _name;
    private _adapter?;
    constructor(name: string, adapter?: SequenceAdapter);
    name: string;
}
export interface Sequencies {
    [name: string]: Sequence;
}
export declare class ERModel {
    private _entities;
    private _sequencies;
    readonly entities: Entities;
    entity(name: string): Entity;
    add(entity: Entity): Entity;
    addSequence(sequence: Sequence): Sequence;
    serialize(): IERModel;
    inspect(): string[];
}
