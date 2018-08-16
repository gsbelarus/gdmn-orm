export declare const MIN_64BIT_INT = -9223372036854776000;
export declare const MAX_64BIT_INT = 9223372036854776000;
export declare const MIN_32BIT_INT = -2147483648;
export declare const MAX_32BIT_INT = 2147483647;
export declare const MIN_16BIT_INT = -32768;
export declare const MAX_16BIT_INT = 32767;
export declare const systemFields: string[];
export interface ISequenceAdapter {
    sequence: string;
}
export interface IEntitySelector {
    field: string;
    value: number | string;
}
export declare type Weak = true;
export interface IRelation {
    relationName: string;
    selector?: IEntitySelector;
    fields?: string[];
    weak?: Weak;
}
export interface IEntityAdapter {
    relation: IRelation[];
    refresh?: boolean;
}
export interface IAttributeAdapter {
    relation: string;
    field: string;
}
export interface ISetAttributeAdapter {
    crossRelation: string;
    presentationField?: string;
}
export interface IParentAttributeAdapter extends IAttributeAdapter {
    lbField: string;
    rbField: string;
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
export interface IDetailAttributeAdapter {
    masterLinks: Array<{
        detailRelation: string;
        link2masterField: string;
    }>;
}
export interface ICrossRelation {
    owner: string;
    selector?: IEntitySelector;
}
export interface ICrossRelations {
    [name: string]: ICrossRelation;
}
export declare function relationName2Adapter(relationName: string): IEntityAdapter;
export declare function relationNames2Adapter(relationNames: string[]): IEntityAdapter;
export declare function appendAdapter(src: IEntityAdapter, relationName: string): IEntityAdapter;
export declare function sameAdapter(mapA: IEntityAdapter, mapB: IEntityAdapter): boolean;
export declare function hasField(em: IEntityAdapter, rn: string, fn: string): boolean;
export declare function isUserDefined(name: string): boolean;
export declare function condition2Selectors(cond: string): IEntitySelector[];
export declare function adjustName(relationName: string): string;
