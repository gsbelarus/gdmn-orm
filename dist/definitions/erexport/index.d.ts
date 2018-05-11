import { DBStructure, ATransaction, AConnection } from "gdmn-db";
import * as erm from '../ermodel';
export declare function erExport(dbs: DBStructure, connection: AConnection, transaction: ATransaction, erModel: erm.ERModel): Promise<erm.ERModel>;
