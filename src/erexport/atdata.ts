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

export async function load(transaction: ATransaction) {
  const atfields = await ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      FIELDNAME,
      LNAME
    FROM
      AT_FIELDS`,
    async (resultSet) =>
    {
      const fields: atFields = {};
      while (await resultSet.next()) {
        fields[resultSet.getString(1)] = {
          lName: {ru: {name: resultSet.getString(2)}}
        };
      }
      return fields;
    }
  );

  const atrelations = await ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      RELATIONNAME,
      LNAME,
      DESCRIPTION
    FROM
      AT_RELATIONS`,
    async (resultSet) =>
    {
      const relations: atRelations = {};
      while (await resultSet.next()) {
        const ru = resultSet.getString(2) !== resultSet.getString(3) ?
          {
            name: resultSet.getString(2),
            fullName: resultSet.getString(3)
          }
          :
          {
            name: resultSet.getString(2),
          };
        relations[resultSet.getString(1)] = {
          lName: {ru},
          relationFields: {}
        };
      }
      return relations;
    }
  );

  await ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      FIELDNAME,
      RELATIONNAME,
      LNAME,
      DESCRIPTION
    FROM
      AT_RELATION_FIELDS
    ORDER BY
      RELATIONNAME`,
    async (resultSet) =>
    {
      let relationName: string = '';
      let rel: atRelation;
      while (await resultSet.next()) {
        if (relationName !== resultSet.getString('RELATIONNAME')) {
          relationName = resultSet.getString('RELATIONNAME');
          rel = atrelations[relationName];
          if (!rel) throw `Unknown relation ${relationName}`;
        }
        const fieldName = resultSet.getString('FIELDNAME');
        const name = resultSet.getString('LNAME');
        const fullName = resultSet.getString('DESCRIPTION');
        const ru = fullName !== name && fullName !== fieldName ? {name, fullName} : {name};
        rel!.relationFields[fieldName] = {lName: {ru}};
      }
    }
  );

  return { atfields, atrelations };
}