import { ERModel } from '../model/ERModel';
import { EntityLink, IEntityLinkInspector } from './EntityLink';
import { EntityQueryOptions, IEntityQueryOptionsInspector } from './EntityQueryOptions';
export interface IEntityQueryInspector {
    link: IEntityLinkInspector;
    options?: IEntityQueryOptionsInspector;
}
export declare class EntityQuery {
    link: EntityLink;
    options?: EntityQueryOptions;
    constructor(query: EntityLink, options?: EntityQueryOptions);
    static deserialize(erModel: ERModel, text: string): EntityQuery;
    static inspectorToObject(erModel: ERModel, inspector: IEntityQueryInspector): EntityQuery;
    serialize(): string;
    inspect(): IEntityQueryInspector;
}
