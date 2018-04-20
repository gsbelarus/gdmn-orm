"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_db_1 = require("gdmn-db");
async function load(transaction) {
    const atfields = await gdmn_db_1.ATransaction.executeQueryResultSet(transaction, `
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
      AT_FIELDS   `, async (resultSet) => {
        const fields = {};
        while (await resultSet.next()) {
            fields[resultSet.getString(1)] = {
                lName: { ru: { name: resultSet.getString(2) } }
            };
        }
        return fields;
    });
    return { atfields };
}
exports.load = load;
//# sourceMappingURL=atdata.js.map