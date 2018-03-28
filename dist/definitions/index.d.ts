export declare type LName = string;
export declare class Attribute {
    readonly name: string;
    readonly lName: LName;
    constructor(name: string, lName: LName);
}
export declare class Field extends Attribute {
    readonly fieldName: string;
    readonly notNull: boolean;
    readonly position: number;
    constructor(name: string, lName: LName, fieldName: string, notNull: boolean);
}
export declare class Constraint extends Attribute {
    readonly constraintName: string;
    readonly attributes: Field[];
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
export declare class SetAttribute extends Attribute {
    readonly associativeEntity: Entity;
}
export declare class WeakAtribute extends Attribute {
    readonly weakEntity: Entity;
}
export interface Attributes {
    [name: string]: Attribute;
}
export declare class Entity {
    readonly parent?: Entity;
    readonly name: string;
    readonly relName: LName;
    readonly lName: LName;
    readonly attributes: Attributes;
    constructor(parent: Entity | undefined, name: string, relName: LName, lName: LName);
}
export interface Entities {
    [name: string]: Entity;
}
export declare class ERModel {
    private entities;
    entity(name: string): Entity;
    add(name: string, relName: LName, lName: LName): Entity;
}
