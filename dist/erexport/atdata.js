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
const getTrimmedStringFunc = (resultSet) => (fieldName) => resultSet.isNull(fieldName) ? undefined : resultSet.getString(fieldName).trim();
async function load(connection, transaction) {
    const atfields = await gdmn_db_1.AConnection.executeQueryResultSet({
        connection,
        transaction,
        sql: `
      SELECT
        FIELDNAME,
        LNAME,
        REFTABLE,
        REFCONDITION,
        SETTABLE,
        SETLISTFIELD,
        SETCONDITION
      FROM
        AT_FIELDS`,
        callback: async (resultSet) => {
            const getTrimmedString = getTrimmedStringFunc(resultSet);
            const fields = {};
            while (await resultSet.next()) {
                fields[resultSet.getString("FIELDNAME")] = {
                    lName: { ru: { name: resultSet.getString("LNAME") } },
                    refTable: getTrimmedString("REFTABLE"),
                    refCondition: getTrimmedString("REFCONDITION"),
                    setTable: getTrimmedString("SETTABLE"),
                    setListField: getTrimmedString("SETLISTFIELD"),
                    setCondition: getTrimmedString("SETCONDITION")
                };
            }
            return fields;
        }
    });
    const atrelations = await gdmn_db_1.AConnection.executeQueryResultSet({
        connection,
        transaction,
        sql: `
      SELECT
        ID,
        RELATIONNAME,
        LNAME,
        DESCRIPTION
      FROM
        AT_RELATIONS`,
        callback: async (resultSet) => {
            const relations = {};
            while (await resultSet.next()) {
                const ru = resultSet.getString(2) !== resultSet.getString(3) ?
                    {
                        name: resultSet.getString(2),
                        fullName: resultSet.getString(3)
                    }
                    :
                        {
                            name: resultSet.getString(2)
                        };
                relations[resultSet.getString(1)] = {
                    lName: { ru },
                    relationFields: {}
                };
            }
            return relations;
        }
    });
    await gdmn_db_1.AConnection.executeQueryResultSet({
        connection,
        transaction,
        sql: `
      SELECT
        FIELDNAME,
        FIELDSOURCE,
        RELATIONNAME,
        LNAME,
        DESCRIPTION,
        CROSSTABLE,
        CROSSFIELD
      FROM
        AT_RELATION_FIELDS
      ORDER BY
        RELATIONNAME`,
        callback: async (resultSet) => {
            const getTrimmedString = getTrimmedStringFunc(resultSet);
            let relationName = "";
            let rel;
            while (await resultSet.next()) {
                if (relationName !== resultSet.getString("RELATIONNAME")) {
                    relationName = resultSet.getString("RELATIONNAME");
                    rel = atrelations[relationName];
                    if (!rel)
                        throw new Error(`Unknown relation ${relationName}`);
                }
                const fieldName = resultSet.getString("FIELDNAME");
                const name = resultSet.getString("LNAME");
                const fullName = resultSet.getString("DESCRIPTION");
                const ru = fullName && fullName !== name && fullName !== fieldName ? { name, fullName } : { name };
                rel.relationFields[fieldName] = {
                    lName: { ru },
                    fieldSource: getTrimmedString("FIELDSOURCE"),
                    crossTable: getTrimmedString("CROSSTABLE"),
                    crossField: getTrimmedString("CROSSFIELD")
                };
            }
        }
    });
    return { atfields, atrelations };
}
exports.load = load;
//# sourceMappingURL=atdata.js.map