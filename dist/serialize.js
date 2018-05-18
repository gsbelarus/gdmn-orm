"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function loadERModel(serialized) {
    const erModel = new ermodel_1.ERModel();
    const createEntity = (e) => {
        let result = erModel.entities[e.name];
        if (!result) {
            let parent = undefined;
            if (e.parent) {
                const pe = serialized.entities.find(p => p.name === e.parent);
                if (!pe) {
                    throw new Error(`Unknown entity ${e.parent}`);
                }
                parent = createEntity(pe);
            }
            erModel.add(result = new ermodel_1.Entity(parent, e.name, e.lName, e.isAbstract));
            e.attributes.forEach(attr => {
                let attribute;
                switch (attr.type) {
                    case 'EntityAttribute':
                    case 'StringAttribute':
                    case 'SetAttribute':
                    case 'ParentAttribute':
                    case 'SequenceAttribute':
                    case 'IntegerAttribute':
                    case 'NumericAttribute':
                    case 'FloatAttribute':
                    case 'BooleanAttribute':
                    case 'DateAttribute':
                    case 'TimeStampAttribute':
                    case 'TimeAttribute':
                    case 'BlobAttribute':
                    case 'EnumAttribute':
                    default:
                        throw new Error(`Unknown attribyte type ${attr.type}`);
                }
            });
        }
        return result;
    };
    serialized.entities.forEach(e => createEntity(e));
    return erModel;
}
exports.loadERModel = loadERModel;
//# sourceMappingURL=serialize.js.map