import { Entity } from "../model/Entity";
import { ERModel } from "../model/ERModel";
import { EntityQueryField, IEntityQueryFieldInspector } from "./EntityQueryField";
export interface IEntityLinkInspector {
    entity: string;
    alias: string;
    fields: IEntityQueryFieldInspector[];
}
export declare class EntityLink {
    entity: Entity;
    alias: string;
    fields: EntityQueryField[];
    constructor(entity: Entity, alias: string, fields: EntityQueryField[]);
    static inspectorToObject(erModel: ERModel, inspector: IEntityLinkInspector): EntityLink;
    deepFindLinkByField(field: EntityQueryField): EntityLink | undefined;
    deepFindLinkByAlias(alias: string): EntityLink | undefined;
    inspect(): IEntityLinkInspector;
}
//# sourceMappingURL=EntityLink.d.ts.map