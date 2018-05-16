import { LName } from './types';
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
    parent?: string;
    name: string;
    lName: LName;
    isAbstract: boolean;
    attributes: IAttribute[];
}
export interface IERModel {
    entities: IEntity[];
}
