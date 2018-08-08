"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_nlp_1 = require("gdmn-nlp");
const Entity_1 = require("./model/Entity");
const ERModel_1 = require("./model/ERModel");
const DetailAttribute_1 = require("./model/link/DetailAttribute");
const EntityAttribute_1 = require("./model/link/EntityAttribute");
const ParentAttribute_1 = require("./model/link/ParentAttribute");
const SetAttribute_1 = require("./model/link/SetAttribute");
const BlobAttribute_1 = require("./model/scalar/BlobAttribute");
const BooleanAttribute_1 = require("./model/scalar/BooleanAttribute");
const EnumAttribute_1 = require("./model/scalar/EnumAttribute");
const DateAttribute_1 = require("./model/scalar/number/DateAttribute");
const FloatAttribute_1 = require("./model/scalar/number/FloatAttribute");
const IntegerAttribute_1 = require("./model/scalar/number/IntegerAttribute");
const NumericAttribute_1 = require("./model/scalar/number/NumericAttribute");
const TimeAttribute_1 = require("./model/scalar/number/TimeAttribute");
const TimeStampAttribute_1 = require("./model/scalar/number/TimeStampAttribute");
const SequenceAttribute_1 = require("./model/scalar/SequenceAttribute");
const StringAttribute_1 = require("./model/scalar/StringAttribute");
const Sequence_1 = require("./model/Sequence");
function deserializeERModel(serialized) {
    const erModel = new ERModel_1.ERModel();
    const createSequence = (sequence) => {
        let result = erModel.sequencies[sequence];
        if (!result) {
            erModel.addSequence(result = new Sequence_1.Sequence({ name: sequence }));
        }
        return result;
    };
    const createEntity = (e) => {
        let result = erModel.entities[e.name];
        if (!result) {
            let parent = undefined;
            if (e.parent) {
                const pe = serialized.entities.find((p) => p.name === e.parent);
                if (!pe) {
                    throw new Error(`Unknown entity ${e.parent}`);
                }
                parent = createEntity(pe);
            }
            erModel.add(result = new Entity_1.Entity({
                name: e.name,
                lName: e.lName,
                parent,
                isAbstract: e.isAbstract,
                semCategories: gdmn_nlp_1.str2SemCategories(e.semCategories)
            }));
        }
        return result;
    };
    const createAttribute = (_attr) => {
        const { name, lName, required } = _attr;
        const semCategories = gdmn_nlp_1.str2SemCategories(_attr.semCategories);
        switch (_attr.type) {
            case 'DetailAttribute': {
                const attr = _attr;
                const entities = attr.references.map((e) => erModel.entities[e]);
                return new DetailAttribute_1.DetailAttribute({ name, lName, required, entities, semCategories });
            }
            case 'ParentAttribute': {
                const attr = _attr;
                const entities = attr.references.map((e) => erModel.entities[e]);
                return new ParentAttribute_1.ParentAttribute({ name, lName, entities, semCategories });
            }
            case 'EntityAttribute': {
                const attr = _attr;
                const entities = attr.references.map((e) => erModel.entity(e));
                return new EntityAttribute_1.EntityAttribute({ name, lName, required, entities, semCategories });
            }
            case 'StringAttribute': {
                const { minLength, maxLength, defaultValue, autoTrim, mask } = _attr;
                return new StringAttribute_1.StringAttribute({
                    name, lName, required, minLength, maxLength, defaultValue, autoTrim, mask, semCategories
                });
            }
            case 'SetAttribute': {
                const attr = _attr;
                const entities = attr.references.map(e => erModel.entities[e]);
                const setAttribute = new SetAttribute_1.SetAttribute({ name, lName, required, entities, semCategories });
                attr.attributes.forEach(a => setAttribute.add(createAttribute(a)));
                return setAttribute;
            }
            case 'SequenceAttribute': {
                const attr = _attr;
                return new SequenceAttribute_1.SequenceAttribute({ name, lName, sequence: createSequence(attr.sequence), semCategories });
            }
            case 'IntegerAttribute': {
                const { minValue, maxValue, defaultValue } = _attr;
                return new IntegerAttribute_1.IntegerAttribute({ name, lName, required, minValue, maxValue, defaultValue, semCategories });
            }
            case 'NumericAttribute': {
                const { precision, scale, minValue, maxValue, defaultValue } = _attr;
                return new NumericAttribute_1.NumericAttribute({
                    name, lName, required, precision, scale, minValue, maxValue, defaultValue, semCategories
                });
            }
            case 'FloatAttribute': {
                const { minValue, maxValue, defaultValue } = _attr;
                return new FloatAttribute_1.FloatAttribute({ name, lName, required, minValue, maxValue, defaultValue, semCategories });
            }
            case 'BooleanAttribute': {
                const { defaultValue } = _attr;
                return new BooleanAttribute_1.BooleanAttribute({ name, lName, required, defaultValue, semCategories });
            }
            case 'DateAttribute': {
                const { minValue, maxValue, defaultValue } = _attr;
                return new DateAttribute_1.DateAttribute({ name, lName, required, minValue, maxValue, defaultValue, semCategories });
            }
            case 'TimeStampAttribute': {
                const { minValue, maxValue, defaultValue } = _attr;
                return new TimeStampAttribute_1.TimeStampAttribute({ name, lName, required, minValue, maxValue, defaultValue, semCategories });
            }
            case 'TimeAttribute': {
                const { minValue, maxValue, defaultValue } = _attr;
                return new TimeAttribute_1.TimeAttribute({ name, lName, required, minValue, maxValue, defaultValue, semCategories });
            }
            case 'BlobAttribute': {
                return new BlobAttribute_1.BlobAttribute({ name, lName, required, semCategories });
            }
            case 'EnumAttribute': {
                const { values, defaultValue } = _attr;
                return new EnumAttribute_1.EnumAttribute({ name, lName, required, values, defaultValue, semCategories });
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