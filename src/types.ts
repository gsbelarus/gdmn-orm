import {SemCategory} from "gdmn-nlp";
import {Attribute} from "./model/Attribute";
import {Entity} from "./model/Entity";
import {ERModel} from "./model/ERModel";
import {Sequence} from "./model/Sequence";

export interface ITName {
  name: string;
  fullName?: string;
}

export interface ILName {
  ru?: ITName;
  by?: ITName;
  en?: ITName;
}

export interface IEnumValue {
  value: string | number;
  lName?: ILName;
}

export type ContextVariables = "CURRENT_TIMESTAMP" | "CURRENT_TIMESTAMP(0)" | "CURRENT_DATE" | "CURRENT_TIME";

export interface IBaseOptions<Adapter = any> {
  name: string;
  adapter?: Adapter;

  [name: string]: any;
}

export interface IBaseSemOptions<Adapter = any> extends IBaseOptions<Adapter> {
  lName: ILName;
  semCategories?: SemCategory[];
}

export interface ITransaction {
  active: boolean;
}

export interface IBaseSource<ParentType, CurType> {
  init(obj: CurType): Promise<CurType>;

  create<T extends CurType>(transaction: ITransaction, parent: ParentType, obj: T): Promise<T>;

  delete(transaction: ITransaction, parent: ParentType, obj: CurType): Promise<void>;
}

export interface IDataSource extends IBaseSource<undefined, ERModel> {
  startTransaction(): Promise<ITransaction>;

  commitTransaction(transaction: ITransaction): Promise<void>;

  rollbackTransaction(transaction: ITransaction): Promise<void>;

  getEntitySource(): IEntitySource;

  getSequenceSource(): ISequenceSource;
}

export interface ISequenceSource extends IBaseSource<ERModel, Sequence> {
  // empty
}

export interface IEntitySource extends IBaseSource<ERModel, Entity> {
  getAttributeSource(): IAttributeSource;

  addUnique(transaction: ITransaction, attrs: Attribute[]): Promise<void>;

  removeUnique(transaction: ITransaction, attrs: Attribute[]): Promise<void>;
}

export interface IAttributeSource extends IBaseSource<Entity, Attribute> {
  // empty
}
