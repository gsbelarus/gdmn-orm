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
export declare type Weak = true;
export interface Relation {
    relationName: string;
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
/**
 * Адаптер для атрибута детальной сущности это массив из объектов,
 * каждый из которых содержит имя детальной таблицы и имя её поля,
 * являющегося внешним ключем на одну из таблиц мастер сущности.
 *
 * Рассмотрим структуру сложного документа. Шапка хранится в двух
 * таблицах:
 *
 *  GD_DOCUMENT -- DOC_HEADER_TABLE
 *
 * позиция тоже хранится в двух таблицах:
 *
 *  GD_DOCUMENT -- DOC_LINE_TABLE
 *
 * В ER модели, сущность документа будет содержать атрибут
 * детальной сущности (позиции документа). Как правило, имя атрибута
 * совпадает с именем детальной таблицы.
 *
 * Адаптер детальной сущности будет содержать следующий массив:
 *
 * [
 *   {
 *     detailRelation: 'GD_DOCUMENT',
 *     link2masterField: 'PARENT'
 *   },
 *   {
 *     detailRelation: 'DOC_LINE_TABLE',
 *     link2masterfield: 'MASTERKEY'
 *   }
 * ]
 */
export interface DetailAttributeMap extends AttributeAdapter {
    masterLinks: [{
        detailRelation: string;
        link2masterField: string;
    }];
}
export interface CrossRelation {
    owner: string;
    selector?: EntitySelector;
}
export interface CrossRelations {
    [name: string]: CrossRelation;
}
export declare function relationName2Adapter(relationName: string): Entity2RelationMap;
export declare function relationNames2Adapter(relationNames: string[]): Entity2RelationMap;
export declare function appendAdapter(src: Entity2RelationMap, relationName: string): Entity2RelationMap;
export declare function sameAdapter(mapA: Entity2RelationMap, mapB: Entity2RelationMap): boolean;
export declare function hasField(em: Entity2RelationMap, rn: string, fn: string): boolean;
export declare function isUserDefined(name: string): boolean;
export declare function condition2Selectors(cond: string): EntitySelector[];
export declare function adjustName(relationName: string): string;
