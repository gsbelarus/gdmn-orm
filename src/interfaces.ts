export interface IAttribute {
  name: string;
  type: string;
  references?: string[];
}

export interface IEntity {
  name: string;
  attributes: IAttribute[];
}

export interface IERModel {
  entities: IEntity[]
}