import { LName } from './types';
import { ERModel } from './ermodel';
export interface IAttribute {
    name: string;
    lName: LName;
    required: boolean;
    calculated: boolean;
    type: string;
    references?: string[];
    attributes?: IAttribute[];
}
export interface IEntity {
    className: string;
    parent?: string;
    name: string;
    lName: LName;
    isAbstract: boolean;
    attributes: IAttribute[];
}
export interface IERModel {
    entities: IEntity[];
}
export declare function loadERModel(serialized: IERModel): ERModel;
