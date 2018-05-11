"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const gdmn_db_1 = require("gdmn-db");
const ermodel_1 = require("../ermodel");
const erexport_1 = require("../erexport");
const rdbadapter_1 = require("../rdbadapter");
const testDB = {
    alias: "test",
    driver: gdmn_db_1.Factory.FBDriver,
    options: {
        host: "localhost",
        port: 3050,
        username: "SYSDBA",
        password: "masterkey",
        path: "c:\\golden\\ns\\gdmn-back\\test\\db\\test.fdb"
    }
};
async function loadERModel(dbDetail) {
    const { driver, options } = dbDetail;
    console.log(JSON.stringify(options));
    console.time("Total load time");
    const result = await gdmn_db_1.AConnection.executeConnection({
        connection: driver.newConnection(),
        options,
        callback: (connection) => gdmn_db_1.AConnection.executeTransaction({
            connection,
            callback: async (transaction) => {
                console.time("DBStructure load time");
                const dbStructure = await driver.readDBStructure(connection, transaction);
                console.log(`DBStructure: ${Object.entries(dbStructure.relations).length} relations loaded...`);
                console.timeEnd("DBStructure load time");
                console.time("erModel load time");
                const erModel = await erexport_1.erExport(dbStructure, connection, transaction, new ermodel_1.ERModel());
                console.log(`erModel: loaded ${Object.entries(erModel.entities).length} entities`);
                console.timeEnd("erModel load time");
                return {
                    dbStructure,
                    erModel
                };
            }
        })
    });
    if (fs.existsSync("c:/temp/test")) {
        fs.writeFileSync("c:/temp/test/ermodel.json", result.erModel.inspect().reduce((p, s) => `${p}${s}\n`, ""));
        console.log("ERModel has been written to c:/temp/test/ermodel.json");
    }
    return result;
}
test("erModel", async () => {
    const result = await loadERModel(testDB);
    const tstTable = result.erModel.entities[rdbadapter_1.adjustName("USR$TST_TABLE")];
    expect(tstTable).toBeDefined();
    expect(tstTable.attribute(rdbadapter_1.adjustName("USR$SET_COMPANY_WF"))).toBeInstanceOf(ermodel_1.SetAttribute);
    expect(tstTable.attribute(rdbadapter_1.adjustName("USR$SET_COMPANY_WOF"))).toBeInstanceOf(ermodel_1.SetAttribute);
});
//# sourceMappingURL=ermodel.test.js.map