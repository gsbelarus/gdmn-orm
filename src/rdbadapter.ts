
import { AttributeAdapter, SequenceAdapter, EntityAdapter, LName } from './types';
import { Entity, Attribute } from './ermodel';
import { ExecSyncOptionsWithBufferEncoding } from 'child_process';
import clone from 'clone';

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

export type Weak = true;

export interface Relation {
  relationName: string,
  selector?: EntitySelector;
  fields?: string[];
  weak?: Weak;
}

export interface Entity2RelationMap extends EntityAdapter {
  relation: Relation[];
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

export interface CrossRelation {
  owner: string;
  selector?: EntitySelector;
}

export interface CrossRelations {
  [name: string]: CrossRelation;
}

export function relationName2Adapter(relationName: string): Entity2RelationMap {
  return {
    relation: [{
      relationName
    }]
  };
}

export function relationNames2Adapter(relationNames: string[]): Entity2RelationMap {
  return { relation: relationNames.map( relationName => ({ relationName }) ) }
}

export function appendAdapter(src: Entity2RelationMap, relationName: string): Entity2RelationMap {
  const em = clone(src);
  if (relationName && !em.relation.find( r => r.relationName === relationName )) {
    em.relation.push({ relationName });
  }
  return em;
}

export function sameAdapter(mapA: Entity2RelationMap, mapB: Entity2RelationMap): boolean {
  const arrA = mapA.relation.filter( r => !r.weak );
  const arrB = mapB.relation.filter( r => !r.weak );
  return arrA.length === arrB.length
    && arrA.every( (a, idx) => a.relationName === arrB[idx].relationName
      && JSON.stringify(a.selector) === JSON.stringify(arrB[idx].selector));
}

export function hasField(em: Entity2RelationMap, rn: string, fn: string): boolean {
  const r = em.relation.find( ar => ar.relationName === rn );

  if (!r) {
    throw new Error(`Can't find relation ${rn} in adapter`);
  }

  return !r.fields || !!r.fields.find( f => f === fn );
}

export function isUserDefined(name: string) {
  return name.substring(0, 4) === 'USR$';
}

export function condition2Selectors(cond: string): EntitySelector[] {
  // conditions like field_name = some_int_value
  const matchA = /([A-Za-z_0-9]+)\s*=\s*([0-9]+)/.exec(cond);
  if (matchA) {
    return [
      {
        field: matchA[1].toUpperCase(),
        value: Number.parseInt(matchA[2])
      }
    ];
  }

  // conditions like field_name in (some_int_value_1 [, some_int_value_2...])
  const matchB = /([A-Za-z_0-9]+)\s+IN\s*\(([0-9,]+)\)/i.exec(cond);
  if (matchB) {
    const regExpC = /([0-9]+)/g;
    const values = matchB[2];
    const result = [];
    let matchC = regExpC.exec(values);
    while (matchC) {
      result.push({ field: matchB[1].toUpperCase(), value: Number.parseInt(matchC[0]) });
      matchC = regExpC.exec(values);
    }
    return result;
  }

  return [];
}

export function adjustName(relationName: string) {
  // return relationName.replace('$', '_');
  return relationName;
}

