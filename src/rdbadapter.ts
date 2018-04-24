
import { AttributeAdapter, SequenceAdapter, EntityAdapter, LName } from './types';
import { Entity, Attribute } from './ermodel';

export const MIN_64BIT_INT = -9223372036854775808;
export const MAX_64BIT_INT = +9223372036854775807;
export const MIN_32BIT_INT = -2147483648;
export const MAX_32BIT_INT = +2147483647;
export const MIN_16BIT_INT = -32768;
export const MAX_16BIT_INT = +32767;

export interface Sequence2SequenceMap extends SequenceAdapter {
  sequence: string;
}

export type RelationStructure = 'PLAIN' | 'TREE' | 'LBRB';

export interface EntitySelector {
  field: string;
  value: number | string;
}

export interface Relation {
  relationName: string,
  structure?: RelationStructure;
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

export function relationName2Adapter(relationName: string): Entity2RelationMap {
  return {
    relation: {
      relationName
    }
  };
}

export function adapter2relationNames(em: Entity2RelationMap): string[] {
  if (Array.isArray(em.relation)) {
    if (!em.relation.length) {
      throw new Error('Invalid entity 2 relation adapter');
    }
    return em.relation.map( r => r.relationName );
  } else {
    return [em.relation.relationName];
  }
}

export function sameAdapter(a: Entity2RelationMap, b: Entity2RelationMap): boolean {
  return adapter2relationNames(a).join() === adapter2relationNames(b).join();
}

