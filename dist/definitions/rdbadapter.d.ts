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
    selector?: EntitySelector;
    fields?: string[];
}
export declare type Weak = true;
export interface WeakRelation extends Relation {
    weak: Weak;
}
export declare type AnyRelation = Relation | WeakRelation;
export declare function isWeakRelation(r: AnyRelation): r is WeakRelation;
export interface Entity2RelationMap extends EntityAdapter {
    relation: Relation | AnyRelation[];
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
export declare function adapter2array(em: Entity2RelationMap): AnyRelation[];
export declare function sameAdapter(mapA: Entity2RelationMap, mapB: Entity2RelationMap): boolean;
export declare function hasField(em: Entity2RelationMap, rn: string, fn: string): boolean;
export declare function isUserDefined(name: string): boolean;
export declare function condition2Selectors(cond: string): EntitySelector[];
