import { LName } from './types';
import { ERModel, Entity } from './ermodel';

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
  entities: IEntity[]
}

export function loadERModel(serialized: IERModel): ERModel {
  const erModel = new ERModel();

  const createEntity = (e: IEntity): Entity => {
    let result = erModel.entities[e.name];

    if (!result) {
      let parent: Entity | undefined = undefined;

      if (e.parent) {
        const pe = serialized.entities.find( p => p.name === e.parent );

        if (!pe) {
          throw new Error(`Unknown entity ${e.parent}`);
        }

        parent = createEntity(pe);
      }

      switch (e.className) {
        case 'Entity':
          result = new Entity(parent, e.name, e.lName, e.isAbstract);
          break;

        default:
          throw new Error(`Unknown entity class ${e.className}`);
      }

      erModel.add(result);
    }

    return result;
  };

  serialized.entities.forEach( e => createEntity(e) );

  return erModel;
}

