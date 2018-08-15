import { Attribute } from "../model/Attribute";
import { Entity } from "../model/Entity";
import { ERModel } from "../model/ERModel";
import { EntityLink, IEntityLinkInspector } from "./EntityLink";
export interface IEntityQueryFieldInspector {
    attribute: string;
    setAttributes?: string[];
    link?: IEntityLinkInspector;
}
export declare class EntityQueryField {
    attribute: Attribute;
    link?: EntityLink;
    setAttributes?: Attribute[];
    constructor(attribute: Attribute, link?: EntityLink, setAttributes?: Attribute[]);
    static inspectorToObject(erModel: ERModel, entity: Entity, inspector: IEntityQueryFieldInspector): EntityQueryField;
    inspect(): IEntityQueryFieldInspector;
}
