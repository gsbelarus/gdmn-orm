import { ERModel } from '../ermodel';
import { EntityLink, IEntitySubQueryInspector } from './EntityLink';
import { EntityQueryOptions, IEntityQueryOptionsInspector } from './EntityQueryOptions';
export interface IEntityQueryInspector {
    link: IEntitySubQueryInspector;
    options?: IEntityQueryOptionsInspector;
}
export declare class EntityQuery {
    link: EntityLink;
    options?: EntityQueryOptions;
    constructor(query: EntityLink, options?: EntityQueryOptions);
    static deserialize(erModel: ERModel, text: string): EntityQuery;
    static inspectorToObject(erModel: ERModel, inspector: IEntityQueryInspector): EntityQuery;
    inspect(): IEntityQueryInspector;
}
