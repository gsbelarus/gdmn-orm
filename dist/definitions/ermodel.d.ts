/**
 *
 */
import { LName, AttributeAdapter, SequenceAdapter, EnumValue, ContextVariables } from './types';
import { IEntity, IAttribute, IERModel, IEntityAttribute, IStringAttribute, ISetAttribute, ISequenceAttribute, INumberAttribute, INumericAttribute, IBooleanAttribute, IEnumAttribute, IDateAttribute } from './serialize';
import { Entity2RelationMap, SetAttribute2CrossMap, DetailAttributeMap } from './rdbadapter';
import { SemCategory } from 'gdmn-nlp';
export declare class Attribute {
    private _name;
    private _lName;
    private _required;
    private _semCategories;
    private _calculated;
    protected _adapter?: AttributeAdapter;
    constructor(name: string, lName: LName, required: boolean, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    readonly adapter: AttributeAdapter | undefined;
    readonly name: string;
    readonly lName: LName;
    readonly required: boolean;
    readonly semCategories: SemCategory[];
    readonly calculated: boolean;
    serialize(): IAttribute;
    inspectDataType(): string;
    inspect(indent?: string): string[];
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
    constructor(name: string, lName: LName, required: boolean, minLength: number | undefined, maxLength: number | undefined, defaultValue: string | undefined, autoTrim: boolean, mask: RegExp | undefined, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    serialize(): IStringAttribute;
    inspectDataType(): string;
}
export declare class SequenceAttribute extends ScalarAttribute {
    private _sequence;
    constructor(name: string, lName: LName, sequence: Sequence, adapter?: AttributeAdapter);
    serialize(): ISequenceAttribute;
}
export declare class NumberAttribute<T, DF = undefined> extends ScalarAttribute {
    private _minValue?;
    private _maxValue?;
    private _defaultValue?;
    constructor(name: string, lName: LName, required: boolean, minValue: T | undefined, maxValue: T | undefined, defaultValue: T | undefined | DF, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    minValue: T | undefined;
    maxValue: T | undefined;
    defaultValue: T | DF | undefined;
    serialize(): INumberAttribute<T, DF>;
}
export declare class IntegerAttribute extends NumberAttribute<number> {
}
export declare class FloatAttribute extends NumberAttribute<number> {
}
export declare class NumericAttribute extends NumberAttribute<number> {
    private _precision;
    private _scale;
    constructor(name: string, lName: LName, required: boolean, precision: number, scale: number, minValue: number | undefined, maxValue: number | undefined, defaultValue: number | undefined, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    inspectDataType(): string;
    serialize(): INumericAttribute;
}
export declare class DateAttribute extends NumberAttribute<Date, ContextVariables> {
    serialize(): IDateAttribute;
}
export declare class TimeAttribute extends NumberAttribute<Date, ContextVariables> {
    serialize(): IDateAttribute;
}
export declare class TimeStampAttribute extends NumberAttribute<Date, ContextVariables> {
    serialize(): IDateAttribute;
}
export declare class BooleanAttribute extends ScalarAttribute {
    private _defaultValue;
    constructor(name: string, lName: LName, required: boolean, defaultValue: boolean, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    defaultValue: boolean;
    serialize(): IBooleanAttribute;
}
export declare class BlobAttribute extends ScalarAttribute {
}
export declare class EnumAttribute extends ScalarAttribute {
    private _values;
    private _defaultValue;
    constructor(name: string, lName: LName, required: boolean, values: EnumValue[], defaultValue: string | number | undefined, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    values: EnumValue[];
    defaultValue: string | number | undefined;
    inspectDataType(): string;
    serialize(): IEnumAttribute;
}
export declare class TimeIntervalAttribute extends ScalarAttribute {
}
export declare class EntityAttribute extends Attribute {
    private _entity;
    constructor(name: string, lName: LName, required: boolean, entity: Entity[], semCategories?: SemCategory[], adapter?: AttributeAdapter);
    readonly entity: Entity[];
    serialize(): IEntityAttribute;
    inspectDataType(): string;
}
export declare class ParentAttribute extends EntityAttribute {
    constructor(name: string, lName: LName, entity: Entity[], semCategories?: SemCategory[], adapter?: AttributeAdapter);
}
export declare class DetailAttribute extends EntityAttribute {
    constructor(name: string, lName: LName, required: boolean, entity: Entity[], semCategories?: SemCategory[], adapter?: DetailAttributeMap);
}
export declare class SetAttribute extends EntityAttribute {
    private _attributes;
    private _presLen;
    constructor(name: string, lName: LName, required: boolean, entity: Entity[], presLen: number, semCategories?: SemCategory[], adapter?: SetAttribute2CrossMap);
    readonly adapter: SetAttribute2CrossMap | undefined;
    attribute(name: string): Attribute;
    add(attribute: Attribute): Attribute;
    readonly attributes: Attributes;
    serialize(): ISetAttribute;
    inspect(indent?: string): string[];
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
    private _semCategories;
    constructor(parent: Entity | undefined, name: string, lName: LName, isAbstract: boolean, semCategories?: SemCategory[], adapter?: Entity2RelationMap);
    readonly pk: Attribute[];
    readonly adapter: Entity2RelationMap;
    readonly unique: Attribute[][];
    addUnique(value: Attribute[]): void;
    readonly attributes: Attributes;
    readonly semCategories: SemCategory[];
    readonly isTree: boolean;
    hasAttribute(name: string): boolean;
    hasOwnAttribute(name: string): boolean;
    attribute(name: string): Attribute;
    attributesBySemCategory(cat: SemCategory): Attribute[];
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
    readonly sequencies: Sequencies;
    readonly entities: Entities;
    entity(name: string): Entity;
    add(entity: Entity): Entity;
    addSequence(sequence: Sequence): Sequence;
    serialize(): IERModel;
    inspect(): string[];
}
