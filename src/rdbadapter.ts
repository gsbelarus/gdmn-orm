
import { AttributeAdapter, SequenceAdapter, EntityAdapter, LName } from './types';
import { Entity, Attribute } from './ermodel';

export const MIN_64BIT_INT = -9223372036854775808;
export const MAX_64BIT_INT = +9223372036854775807;
export const MIN_32BIT_INT = -2147483648;
export const MAX_32BIT_INT = +2147483647;
export const MIN_16BIT_INT = -32768;
export const MAX_16BIT_INT = +32767;

export const systemFields = [
  'AVIEW',
  'ACHAG',
  'AFULL',
  'DISABLED',
  'CREATIONDATE',
  'CREATORKEY',
  'EDITIONDATE',
  'EDITORKEY'
];

export interface Sequence2SequenceMap extends SequenceAdapter {
  sequence: string;
}

export interface EntitySelector {
  field: string;
  value: number | string;
}

export interface Relation {
  relationName: string,
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

export function adapter2array(em: Entity2RelationMap): Relation[] {
  if (Array.isArray(em.relation)) {
    if (!em.relation.length) {
      throw new Error('Invalid entity 2 relation adapter');
    }
    return em.relation;
  } else {
    return [em.relation];
  }
}

export function adapter2relationNames(em: Entity2RelationMap): string[] {
  return adapter2array(em).map( r => r.relationName );
}

export function sameAdapter(a: Entity2RelationMap, b: Entity2RelationMap): boolean {
  const arrA = adapter2array(a);
  const arrB = adapter2array(b);
  return arrA.length === arrB.length
    && arrA.every( (a, idx) => idx < arrB.length && a.relationName === arrB[idx].relationName
      && JSON.stringify(a.selector) === JSON.stringify(arrB[idx].selector));
}

export function hasField(em: Entity2RelationMap, rn: string, fn: string): boolean {
  let r: Relation | undefined;

  if (Array.isArray(em.relation)) {
    r = em.relation.find( rel => rel.relationName === rn );
  } else {
    if (em.relation.relationName === rn) {
      r = em.relation;
    }
  }

  if (!r) {
    throw new Error(`Can't find relation ${rn} in adapter`);
  }

  return !r.fields || !!r.fields.find( f => f === fn );
}

export function isUserDefined(name: string) {
  return name.substring(0, 4) === 'USR$';
}

