import { Attribute, Entity } from '../ermodel';
export interface IEntityQueryWhereInspector {
    not?: IEntityQueryWhereInspector;
    or?: IEntityQueryWhereInspector;
    and?: IEntityQueryWhereInspector;
    isNull?: IEntityLinkAlias<string>;
    equals?: IEntityLinkAlias<{
        [fieldName: string]: any;
    }>;
    greater?: IEntityLinkAlias<{
        [fieldName: string]: any;
    }>;
    less?: IEntityLinkAlias<{
        [fieldName: string]: any;
    }>;
}
export interface IEntityQueryOptionsInspector {
    first?: number;
    skip?: number;
    where?: IEntityQueryWhereInspector;
    order?: IEntityLinkAlias<{
        [fieldName: string]: string;
    }>;
}
export interface IEntityQueryWhere {
    not?: IEntityQueryWhere;
    or?: IEntityQueryWhere;
    and?: IEntityQueryWhere;
    isNull?: IEntityLinkAlias<Attribute>;
    equals?: IEntityLinkAlias<Map<Attribute, any>>;
    greater?: IEntityLinkAlias<Map<Attribute, any>>;
    less?: IEntityLinkAlias<Map<Attribute, any>>;
}
export interface IEntityLinkAlias<V> {
    [alias: string]: V;
}
export declare enum EntityQueryOrder {
    ASC = "asc",
    DESC = "desc",
}
export declare class EntityQueryOptions {
    first?: number;
    skip?: number;
    where?: IEntityQueryWhere;
    order?: IEntityLinkAlias<Map<Attribute, EntityQueryOrder>>;
    constructor(first?: number, skip?: number, where?: IEntityQueryWhere, order?: IEntityLinkAlias<Map<Attribute, EntityQueryOrder>>);
    static inspectorToObject(entity: Entity, inspector: IEntityQueryOptionsInspector): EntityQueryOptions;
    private static inspectorWhereToObject(entity, inspector?);
    private static _inspectorToObjectMap(entity, map?);
    private static _inspectMap(map?);
    private static _inspectWhere(where?);
    inspect(): IEntityQueryOptionsInspector;
}
