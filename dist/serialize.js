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
            e.attributes.forEach(_attr => {
                const { name, lName, required, calculated } = _attr;
                switch (_attr.type) {
                    case 'DetailAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.DetailAttribute(name, lName, required, attr.references.map(e => erModel.entities[e])));
                        break;
                    }
                    case 'ParentAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.ParentAttribute(name, lName, attr.references.map(e => erModel.entities[e])));
                        break;
                    }
                    case 'EntityAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.EntityAttribute(name, lName, required, attr.references.map(e => erModel.entities[e])));
                        break;
                    }
                    case 'StringAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.StringAttribute(name, lName, required, attr.minLength, attr.maxLength, attr.defaultValue, attr.autoTrim, attr.mask));
                        break;
                    }
                    case 'SetAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.SetAttribute(name, lName, required, attr.references.map(e => erModel.entities[e]), attr.presLen));
                        break;
                    }
                    case 'SequenceAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.SequenceAttribute(name, lName, createSequence(attr.sequence)));
                        break;
                    }
                    case 'IntegerAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.IntegerAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'NumericAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.NumericAttribute(name, lName, required, attr.precision, attr.scale, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'FloatAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.FloatAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'BooleanAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.BooleanAttribute(name, lName, required, attr.defaultValue));
                        break;
                    }
                    case 'DateAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.DateAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'TimeStampAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.TimeStampAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'TimeAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.TimeAttribute(name, lName, required, attr.minValue, attr.maxValue, attr.defaultValue));
                        break;
                    }
                    case 'BlobAttribute': {
                        result.add(new ermodel_1.BLOBAttribute(name, lName, required));
                        break;
                    }
                    case 'EnumAttribute': {
                        const attr = _attr;
                        result.add(new ermodel_1.EnumAttribute(name, lName, required, attr.values, attr.defaultValue));
                        break;
                    }
                    default:
                        throw new Error(`Unknown attribyte type ${_attr.type}`);
                }
            });
        }
        return result;
    };
    serialized.entities.forEach(e => createEntity(e));
    return erModel;
}
exports.deserializeERModel = deserializeERModel;
//# sourceMappingURL=serialize.js.map