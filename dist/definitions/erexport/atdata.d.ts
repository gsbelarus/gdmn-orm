/**
 * at_* таблицы платформы Гедымин хранят дополнительную информацию по доменам,
 * таблицам и полям. При построении сущностей мы используем эту информацию
 * вместе с информацией о структуре базу данных.
 * Чтобы каждый раз не выполнять отдельные запросы, мы изначально загружаем
 * все данные в объекты.
 */
import { ATransaction } from 'gdmn-db';
import { LName } from '../types';
/**
 * Дополнительная информация по доменам.
 */
export interface atField {
    lName: LName;
    refTable: string | undefined;
    refCondition: string | undefined;
}
export interface atFields {
    [fieldName: string]: atField;
}
/**
 * Дополнительная информация по полям таблиц.
 */
export interface atRelationField {
    lName: LName;
}
export interface atRelationFields {
    [fieldName: string]: atRelationField;
}
/**
 * Дополнительная информация по таблицам.
 */
export interface atRelation {
    lName: LName;
    relationFields: atRelationFields;
}
export interface atRelations {
    [relationName: string]: atRelation;
}
export declare function load(transaction: ATransaction): Promise<{
    atfields: atFields;
    atrelations: atRelations;
}>;
