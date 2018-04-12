/**
 *
 */
import { LName, EntityAdapter, AttributeAdapter, SequenceAdapter } from './types';
import { IEntity } from './interfaces';
export declare type ContextVariables = 'CURRENT_TIMESTAMP' | 'CURRENT_DATE' | 'CURRENT_TIME';
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
    minValue: T;
    maxValue: T;
    defaultValue: T | DF;
}
export declare class IntegerAttribute extends NumberAttribute<number> {
}
export declare class FloatAttribute extends NumberAttribute<number> {
}
export declare class NumericAttribute extends NumberAttribute<number> {
}
export declare class DateAttribute extends NumberAttribute<Date> {
}
export declare class TimeAttribute extends NumberAttribute<Date> {
}
export declare class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> {
}
export declare class BooleanAttribute extends ScalarAttribute {
    private _defaultValue;
    constructor(name: string, lName: LName, required: boolean, defaultValue: boolean, adapter?: AttributeAdapter);
}
export declare class EnumAttribute extends ScalarAttribute {
}
export declare class TimeIntervalAttribute extends ScalarAttribute {
}
export declare class EntityAttribute extends Attribute {
    private _entity;
    constructor(name: string, lName: LName, required: boolean, entity: Entity[], adapter?: AttributeAdapter);
    readonly entity: Entity[];
}
export declare class ParentAttribute extends EntityAttribute {
    constructor(name: string, lName: LName, entity: Entity[], adapter?: AttributeAdapter);
}
export declare class DetailAttribute extends EntityAttribute {
}
export declare class SetAttribute extends EntityAttribute {
    private _fields;
}
export declare class Entity {
    readonly parent?: Entity;
    readonly name: string;
    readonly lName: LName;
    readonly isAbstract: boolean;
    readonly adapter?: EntityAdapter;
    private _pk;
    private _attributes;
    private _unique;
    constructor(parent: Entity | undefined, name: string, lName: LName, isAbstract: boolean, adapter?: EntityAdapter);
    readonly pk: Attribute[];
    readonly attributes: Attributes;
    readonly unique: Attribute[][];
    addUnique(value: any): void;
    attribute(name: string): Attribute;
    add(attribute: Attribute): Attribute;
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
    serialize(): {
        entities: IEntity[];
    };
}
