
import { EntityAdapter, AttributeAdapter } from './types';

export const MAX_32BIT_INT = 2147483647;

export interface Sequence2SequenceMap {
  sequence: string;
}

export type RelationStructure = 'PLAIN' | 'TREE' | 'LBRB';

export interface EntitySelector {
  relation?: string;
  field: string;
  value: number | string;
}

export interface Entity2TableMap extends EntityAdapter {
  relation: string | string[];
  weakRelation?: string;
  structure: RelationStructure;
  selector?: EntitySelector;
  refresh?: boolean;
}

export interface Attribute2FieldMap extends AttributeAdapter {
  relation?: string;
  field: string;
}
