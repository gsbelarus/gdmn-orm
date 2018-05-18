"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function deserializeERModel(serialized) {
    const erModel = new ermodel_1.ERModel();
    const createSequence = (sequence) => {
        let result = erModel.sequencies[sequence];
        if (!result) {
            erModel.addSequence(result = new ermodel_1.Sequence(sequence));
        }
        return result;
    };
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
        }
        return result;
    };
    const createAttribute = (_attr) => {
        const { name, lName, required, calculated } = _attr;
        switch (_attr.type) {
            case 'DetailAttribute': {
                const attr = _attr;
                return new ermodel_1.DetailAttribute(name, lName, required, attr.references.map(e => erModel.entities[e]));
            }
            case 'ParentAttribute': {
                const attr = _attr;
                return new ermodel_1.ParentAttribute(name, lName, attr.references.map(e => erModel.entities[e]));
            }
            case 'EntityAttribute': {
                const attr = _attr;
                return new ermodel_1.EntityAttribute(name, lName, required, attr.references.map(e => erModel.entity(e)));
            }
            case 'StringAttribute': {
                const attr = _attr;
                return new ermodel_1.StringAttribute(name, lName, required, attr.minLength, attr.maxLength, attr.defaultValue, attr.autoTrim, attr.mask);
            }
            case 'SetAttribute': {
                const attr = _attr;
                const setAttribute = new ermodel_1.SetAttribute(name, lName, required, attr.references.map(e => erModel.entities[e]), attr.presLen);
                attr.attributes.forEach(a => setAttribute.add(createAttribute(a)));
                return setAttribute;
            }
            case 'SequenceAttribute': {
                const attr = _attr;
                return new ermodel_1.SequenceAttribute(name, lName, createSequence(attr.sequence));
            }
            case 'IntegerAttribute': {
                const attr = _attr;
                return new ermodel_1.IntegerAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'NumericAttribute': {
                const attr = _attr;
                return new ermodel_1.NumericAttribute(name, lName, required, attr.precision, attr.scale, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'FloatAttribute': {
                const attr = _attr;
                return new ermodel_1.FloatAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'BooleanAttribute': {
                const attr = _attr;
                return new ermodel_1.BooleanAttribute(name, lName, required, attr.defaultValue);
            }
            case 'DateAttribute': {
                const attr = _attr;
                return new ermodel_1.DateAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'TimeStampAttribute': {
                const attr = _attr;
                return new ermodel_1.TimeStampAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'TimeAttribute': {
                const attr = _attr;
                return new ermodel_1.TimeAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue);
            }
            case 'BlobAttribute': {
                return new ermodel_1.BlobAttribute(name, lName, required);
            }
            case 'EnumAttribute': {
                const attr = _attr;
                return new ermodel_1.EnumAttribute(name, lName, required, attr.values, attr.defaultValue);
            }
            default:
                throw new Error(`Unknown attribyte type ${_attr.type}`);
        }
    };
    const createAttributes = (e) => {
        const entity = erModel.entity(e.name);
        e.attributes.forEach(_attr => entity.add(createAttribute(_attr)));
    };
    serialized.entities.forEach(e => createEntity(e));
    serialized.entities.forEach(e => createAttributes(e));
    return erModel;
}
exports.deserializeERModel = deserializeERModel;
//# sourceMappingURL=serialize.js.map