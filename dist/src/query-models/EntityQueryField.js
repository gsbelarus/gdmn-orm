"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityLink_1 = require("./EntityLink");
class EntityQueryField {
    constructor(attribute, link, setAttributes) {
        this.attribute = attribute;
        this.link = link;
        this.setAttributes = setAttributes;
    }
    static inspectorToObject(erModel, entity, inspector) {
        return new EntityQueryField(entity.attribute(inspector.attribute), inspector.link && EntityLink_1.EntityLink.inspectorToObject(erModel, inspector.link), inspector.setAttributes && inspector.setAttributes.map((attr) => entity.attribute(attr)));
    }
    inspect() {
        const inspect = { attribute: this.attribute.name };
        if (this.link) {
            inspect.link = this.link.inspect();
        }
        if (this.setAttributes) {
            inspect.setAttributes = this.setAttributes.map((attr) => attr.name);
        }
        return inspect;
    }
}
exports.EntityQueryField = EntityQueryField;
//# sourceMappingURL=EntityQueryField.js.map