import { ATransaction } from 'gdmn-db';
import { LName } from '../types';

export interface atField {
  lName: LName;
}

export interface atFields {
  [fieldName: string]: atField;
}

export async function load(transaction: ATransaction) {
  const atfields = await ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      FIELDNAME,
      LNAME,
      DESCRIPTION,
      REFTABLE,
      REFLISTFIELD,
      REFCONDITION,
      REFTABLEKEY,
      REFLISTFIELDKEY,
      SETTABLE,
      SETLISTFIELD,
      SETCONDITION,
      SETTABLEKEY,
      SETLISTFIELDKEY,
      ALIGNMENT,
      FORMAT,
      VISIBLE,
      COLWIDTH,
      READONLY,
      GDCLASSNAME,
      GDSUBTYPE,
      NUMERATION,
      DISABLED,
      EDITIONDATE,
      EDITORKEY,
      RESERVED
    FROM
      AT_FIELDS   `,
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

  return { atfields };
}