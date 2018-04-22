
import { AttributeAdapter, SequenceAdapter, EntityAdapter } from './types';
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


