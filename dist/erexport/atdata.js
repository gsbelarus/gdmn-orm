"use strict";
/**
 * at_* таблицы платформы Гедымин хранят дополнительную информацию по доменам,
 * таблицам и полям. При построении сущностей мы используем эту информацию
 * вместе с информацией о структуре базу данных.
 * Чтобы каждый раз не выполнять отдельные запросы, мы изначально загружаем
 * все данные в объекты.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_db_1 = require("gdmn-db");
async function load(transaction) {
    const atfields = await gdmn_db_1.ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      FIELDNAME,
      LNAME
    FROM
      AT_FIELDS`, async (resultSet) => {
        const fields = {};
        while (await resultSet.next()) {
            fields[resultSet.getString(1)] = {
                lName: { ru: { name: resultSet.getString(2) } }
            };
        }
        return fields;
    });
    const atrelations = await gdmn_db_1.ATransaction.executeQueryResultSet(transaction, `
    SELECT
      ID,
      RELATIONNAME,
      LNAME,
      DESCRIPTION
    FROM
      AT_RELATIONS`, async (resultSet) => {
        const relations = {};
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
                lName: { ru },
                relationFields: {}
            };
        }
        return relations;
    });
    await gdmn_db_1.ATransaction.executeQueryResultSet(transaction, `
    SELECT
      FIELDNAME, RELATIONNAME, LNAME, DESCRIPTION
    FROM
      AT_RELATION_FIELDS
    ORDER BY
      RELATIONNAME`, async (resultSet) => {
        let relationName = '';
        let rel;
        while (await resultSet.next()) {
            if (relationName !== resultSet.getString('RELATIONNAME')) {
                relationName = resultSet.getString('RELATIONNAME');
                rel = atrelations[relationName];
                if (!rel)
                    throw new Error(`Unknown relation ${relationName}`);
            }
            const fieldName = resultSet.getString('FIELDNAME');
            const name = resultSet.getString('LNAME');
            const fullName = resultSet.getString('DESCRIPTION');
            const ru = fullName !== name && fullName !== fieldName ? { name, fullName } : { name };
            rel.relationFields[fieldName] = { lName: { ru } };
        }
    });
    return { atfields, atrelations };
}
exports.load = load;
//# sourceMappingURL=atdata.js.map