/**
 *
 */
export declare type LName = string;
export declare class Attribute {
    readonly name: string;
    readonly lName?: LName;
    constructor(name: string, lName?: LName);
}
export interface Attributes {
    [name: string]: Attribute;
}
export declare class Field extends Attribute {
    private _required;
    private _position;
    required: boolean;
    position: number;
}
export interface Fields {
    [name: string]: Field;
}
export declare class Constraint extends Attribute {
    private _fields;
    readonly fields: Field[];
    field(name: string): Field;
    add(field: Field): number;
}
export declare class PrimaryKey extends Constraint {
}
export declare class ForeignKey extends Constraint {
    readonly references: Entity;
}
export declare class UniqueKey extends Constraint {
}
export declare class StringField extends Field {
}
export declare class NumericField extends Field {
}
export declare class IntegerField extends NumericField {
}
export declare class SetAttribute extends Attribute {
    readonly associativeEntity: Entity;
}
export declare class WeakAtribute extends Attribute {
    readonly weakEntity: Entity;
}
export declare class Entity {
    readonly parent?: Entity;
    readonly name: string;
    readonly relName: string;
    readonly lName?: LName;
    readonly isAbstract: boolean;
    private _attributes;
    constructor(parent: Entity | undefined, name: string, relName: string, isAbstract: boolean, lName?: LName);
    readonly attributes: Attributes;
    attribute(name: string): Attribute;
    add(attribute: Attribute): Attribute;
}
export interface Entities {
    [name: string]: Entity;
}
export declare class ERModel {
    private _entities;
    readonly entities: Entities;
    entity(name: string): Entity;
    add(entity: Entity): Entity;
}
