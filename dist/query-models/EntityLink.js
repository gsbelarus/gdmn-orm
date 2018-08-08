"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityQueryField_1 = require("./EntityQueryField");
class EntityLink {
    constructor(entity, alias, fields) {
        this.entity = entity;
        this.alias = alias;
        this.fields = fields;
    }
    static inspectorToObject(erModel, inspector) {
        const entity = erModel.entity(inspector.entity);
        const alias = inspector.alias;
        const fields = inspector.fields.map((inspectorField) => (EntityQueryField_1.EntityQueryField.inspectorToObject(erModel, entity, inspectorField)));
        return new EntityLink(entity, alias, fields);
    }
    deepFindLinkByField(field) {
        const find = this.fields
            .filter((qField) => !qField.link)
            .some((qField) => qField === field);
        if (find) {
            return this;
        }
        for (const qField of this.fields) {
            if (qField.link) {
                const findLink = qField.link.deepFindLinkByField(field);
                if (findLink) {
                    return findLink;
                }
            }
        }
    }
    deepFindLinkByAlias(alias) {
        if (this.alias === alias) {
            return this;
        }
        for (const field of this.fields) {
            if (field.link) {
                const find = field.link.deepFindLinkByAlias(alias);
                if (find) {
                    return find;
                }
            }
        }
    }
    inspect() {
        return {
            entity: this.entity.name,
            alias: this.alias,
            fields: this.fields.map((field) => field.inspect())
        };
    }
}
exports.EntityLink = EntityLink;
//# sourceMappingURL=EntityLink.js.map