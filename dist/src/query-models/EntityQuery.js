"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityLink_1 = require("./EntityLink");
const EntityQueryOptions_1 = require("./EntityQueryOptions");
class EntityQuery {
    constructor(query, options) {
        this.link = query;
        this.options = options;
    }
    static deserialize(erModel, text) {
        return EntityQuery.inspectorToObject(erModel, JSON.parse(text));
    }
    static inspectorToObject(erModel, inspector) {
        const link = EntityLink_1.EntityLink.inspectorToObject(erModel, inspector.link);
        const options = inspector.options && EntityQueryOptions_1.EntityQueryOptions.inspectorToObject(link, inspector.options);
        return new EntityQuery(link, options);
    }
    serialize() {
        return JSON.stringify(this.inspect());
    }
    inspect() {
        const inspect = { link: this.link.inspect() };
        if (this.options) {
            inspect.options = this.options.inspect();
        }
        return inspect;
    }
}
exports.EntityQuery = EntityQuery;
//# sourceMappingURL=EntityQuery.js.map