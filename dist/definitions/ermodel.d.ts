/**
 *
 */
import { AttributeAdapter, ContextVariables, EnumValue, LName, SequenceAdapter } from './types';
import { IAttribute, IBooleanAttribute, IDateAttribute, IEntity, IEntityAttribute, IEnumAttribute, IERModel, INumberAttribute, INumericAttribute, ISequenceAttribute, ISetAttribute, IStringAttribute } from './serialize';
import { DetailAttributeMap, Entity2RelationMap, SetAttribute2CrossMap } from './rdbadapter';
import { SemCategory } from 'gdmn-nlp';
export declare class Attribute {
    private readonly _name;
    private readonly _lName;
    private readonly _required;
    private readonly _semCategories;
    private readonly _calculated;
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
    private readonly _minLength?;
    private readonly _maxLength?;
    private readonly _defaultValue?;
    private readonly _mask?;
    private readonly _autoTrim;
    constructor(name: string, lName: LName, required: boolean, minLength: number | undefined, maxLength: number | undefined, defaultValue: string | undefined, autoTrim: boolean, mask: RegExp | undefined, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    readonly minLength: number | undefined;
    readonly maxLength: number | undefined;
    readonly defaultValue: string | undefined;
    readonly mask: RegExp | undefined;
    readonly autoTrim: boolean;
    serialize(): IStringAttribute;
    inspectDataType(): string;
}
export declare class SequenceAttribute extends ScalarAttribute {
    private readonly _sequence;
    constructor(name: string, lName: LName, sequence: Sequence, adapter?: AttributeAdapter);
    readonly sequence: Sequence;
    serialize(): ISequenceAttribute;
}
export declare class NumberAttribute<T, DF = undefined> extends ScalarAttribute {
    private readonly _minValue?;
    private readonly _maxValue?;
    private readonly _defaultValue?;
    constructor(name: string, lName: LName, required: boolean, minValue: T | undefined, maxValue: T | undefined, defaultValue: T | undefined | DF, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    readonly minValue: T | undefined;
    readonly maxValue: T | undefined;
    readonly defaultValue: T | DF | undefined;
    serialize(): INumberAttribute<T, DF>;
}
export declare class IntegerAttribute extends NumberAttribute<number> {
}
export declare class FloatAttribute extends NumberAttribute<number> {
}
export declare class NumericAttribute extends NumberAttribute<number> {
    private readonly _precision;
    private readonly _scale;
    constructor(name: string, lName: LName, required: boolean, precision: number, scale: number, minValue: number | undefined, maxValue: number | undefined, defaultValue: number | undefined, semCategories?: SemCategory[], adapter?: AttributeAdapter);
    readonly precision: number;
    readonly scale: number;
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
    private readonly _attributes;
    private readonly _presLen;
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
    private readonly _adapter?;
    private readonly _pk;
    private readonly _attributes;
    private readonly _unique;
    private readonly _semCategories;
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
    readonly adapter: SequenceAdapter | undefined;
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
