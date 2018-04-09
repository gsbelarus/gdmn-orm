
import { EntityAdapter, AttributeAdapter } from './types';

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
}

export interface Attribute2FieldMap extends AttributeAdapter {
  relation?: string;
  field: string;
}