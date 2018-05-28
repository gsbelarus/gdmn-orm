import { Entity, ERModel } from '../ermodel';
import { EntityQueryField, IEntityQueryFieldInspector } from './EntityQueryField';
export interface IEntitySubQueryInspector {
    entity: string;
    alias: string;
    fields: IEntityQueryFieldInspector[];
}
export declare class EntityLink {
    entity: Entity;
    alias: string;
    fields: EntityQueryField[];
    constructor(entity: Entity, alias: string, fields: EntityQueryField[]);
    static inspectorToObject(erModel: ERModel, inspector: IEntitySubQueryInspector): EntityLink;
    deepFindLinkByField(field: EntityQueryField): EntityLink | undefined;
    deepFindLinkByAlias(alias: string): EntityLink | undefined;
    inspect(): IEntitySubQueryInspector;
}
