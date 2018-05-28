import {Entity, ERModel} from '../ermodel';
import {EntityQueryField, IEntityQueryFieldInspector} from './EntityQueryField';

export interface IEntitySubQueryInspector {
  entity: string;
  alias: string;
  fields: IEntityQueryFieldInspector[];
}

export class EntityLink {

  public entity: Entity;
  public alias: string;
  public fields: EntityQueryField[];

  constructor(entity: Entity, alias: string, fields: EntityQueryField[]) {
    this.entity = entity;
    this.alias = alias;
    this.fields = fields;
  }

  public static inspectorToObject(erModel: ERModel, inspector: IEntitySubQueryInspector): EntityLink {
    const entity = erModel.entity(inspector.entity);
    const alias = inspector.alias;
    const fields = inspector.fields.map((inspectorField) => (
      EntityQueryField.inspectorToObject(erModel, entity, inspectorField)
    ));

    return new EntityLink(entity, alias, fields);
  }

  public inspect(): IEntitySubQueryInspector {
    return {
      entity: this.entity.name,
      alias: this.alias,
      fields: this.fields.map((field) => field.inspect())
    };
  }
}
