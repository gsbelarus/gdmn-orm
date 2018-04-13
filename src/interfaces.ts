export interface IAttribute {
  name: string;
  type: string;
  references?: string[];
  attributes?: IAttribute[];
}

export interface IEntity {
  parent?: string;
  name: string;
  attributes: IAttribute[];
}

export interface IERModel {
  entities: IEntity[]
}