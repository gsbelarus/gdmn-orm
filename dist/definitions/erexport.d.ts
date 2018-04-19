import { DBStructure, ATransaction } from 'gdmn-db';
import * as erm from './ermodel';
export declare function erExport(dbs: DBStructure, transaction: ATransaction, erModel: erm.ERModel): Promise<erm.ERModel>;
