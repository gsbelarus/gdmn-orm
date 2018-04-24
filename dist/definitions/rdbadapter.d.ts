import { AttributeAdapter, SequenceAdapter, EntityAdapter } from './types';
export declare const MIN_64BIT_INT = -9223372036854776000;
export declare const MAX_64BIT_INT = 9223372036854776000;
export declare const MIN_32BIT_INT = -2147483648;
export declare const MAX_32BIT_INT = 2147483647;
export declare const MIN_16BIT_INT = -32768;
export declare const MAX_16BIT_INT = 32767;
export declare const systemFields: string[];
export interface Sequence2SequenceMap extends SequenceAdapter {
    sequence: string;
}
export interface EntitySelector {
    field: string;
    value: number | string;
}
export interface Relation {
    relationName: string;
    weak?: boolean;
    selector?: EntitySelector;
    fields?: string[];
}
export interface Entity2RelationMap extends EntityAdapter {
    relation: Relation | Relation[];
    refresh?: boolean;
}
export interface Attribute2FieldMap extends AttributeAdapter {
    relation: string;
    field: string;
}
export interface SetAttribute2CrossMap extends AttributeAdapter {
    crossRelation: string;
    presentationField?: string;
}
export declare function relationName2Adapter(relationName: string): Entity2RelationMap;
export declare function adapter2relationNames(em: Entity2RelationMap): string[];
export declare function sameAdapter(a: Entity2RelationMap, b: Entity2RelationMap): boolean;
export declare function hasField(em: Entity2RelationMap, rn: string, fn: string): boolean;
