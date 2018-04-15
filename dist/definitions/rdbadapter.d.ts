import { EntityAdapter, AttributeAdapter, SequenceAdapter } from './types';
export declare const MAX_32BIT_INT = 2147483647;
export declare const MIN_16BIT_INT = -32768;
export declare const MAX_16BIT_INT = 32767;
export interface Sequence2SequenceMap extends SequenceAdapter {
    sequence: string;
}
export declare type RelationStructure = 'PLAIN' | 'TREE' | 'LBRB';
export interface EntitySelector {
    field: string;
    value: number | string;
}
export interface Relation {
    relation: string;
    structure?: RelationStructure;
    weak?: boolean;
    selector?: EntitySelector;
}
export interface Entity2RelationMap extends EntityAdapter {
    relation: Relation | Relation[];
    refresh?: boolean;
}
export interface Attribute2FieldMap extends AttributeAdapter {
    relation?: string;
    field?: string;
}
export interface SetAttribute2CrossMap extends AttributeAdapter {
    crossRelation: string;
    presentationField?: string;
}
