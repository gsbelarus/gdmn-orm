import { DetailAttributeAdapter } from '../../rdbadapter';
import { Attribute } from '../Attribute';
import { EntityAttribute, IEntityAttributeOptions } from './EntityAttribute';
export declare class DetailAttribute extends EntityAttribute<DetailAttributeAdapter> {
    constructor(options: IEntityAttributeOptions<DetailAttributeAdapter>);
    static isType(type: Attribute): type is DetailAttribute;
}
