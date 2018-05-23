"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ermodel_1 = require("./ermodel");
function isScalarAttribute(attribute) {
    return attribute instanceof ermodel_1.ScalarAttribute;
}
exports.isScalarAttribute = isScalarAttribute;
function isStringAttribute(attribute) {
    return attribute instanceof ermodel_1.StringAttribute;
}
exports.isStringAttribute = isStringAttribute;
function isSequenceAttribute(attribute) {
    return attribute instanceof ermodel_1.SequenceAttribute;
}
exports.isSequenceAttribute = isSequenceAttribute;
function isNumberAttribute(attribute) {
    return attribute instanceof ermodel_1.NumberAttribute;
}
exports.isNumberAttribute = isNumberAttribute;
function isIntegerAttribute(attribute) {
    return attribute instanceof ermodel_1.IntegerAttribute;
}
exports.isIntegerAttribute = isIntegerAttribute;
function isFloatAttribute(attribute) {
    return attribute instanceof ermodel_1.FloatAttribute;
}
exports.isFloatAttribute = isFloatAttribute;
function isNumericAttribute(attribute) {
    return attribute instanceof ermodel_1.NumericAttribute;
}
exports.isNumericAttribute = isNumericAttribute;
function isDateAttribute(attribute) {
    return attribute instanceof ermodel_1.DateAttribute;
}
exports.isDateAttribute = isDateAttribute;
function isTimeAttribute(attribute) {
    return attribute instanceof ermodel_1.TimeAttribute;
}
exports.isTimeAttribute = isTimeAttribute;
function isTimeStampAttribute(attribute) {
    return attribute instanceof ermodel_1.TimeStampAttribute;
}
exports.isTimeStampAttribute = isTimeStampAttribute;
function isBooleanAttribute(attribute) {
    return attribute instanceof ermodel_1.BooleanAttribute;
}
exports.isBooleanAttribute = isBooleanAttribute;
function isBlobAttribute(attribute) {
    return attribute instanceof ermodel_1.BlobAttribute;
}
exports.isBlobAttribute = isBlobAttribute;
function isEnumAttribute(attribute) {
    return attribute instanceof ermodel_1.EnumAttribute;
}
exports.isEnumAttribute = isEnumAttribute;
function isTimeIntervalAttribute(attribute) {
    return attribute instanceof ermodel_1.TimeIntervalAttribute;
}
exports.isTimeIntervalAttribute = isTimeIntervalAttribute;
function isEntityAttribute(attribute) {
    return attribute instanceof ermodel_1.EntityAttribute;
}
exports.isEntityAttribute = isEntityAttribute;
function isParentAttribute(attribute) {
    return attribute instanceof ermodel_1.ParentAttribute;
}
exports.isParentAttribute = isParentAttribute;
function isDetailAttribute(attribute) {
    return attribute instanceof ermodel_1.DetailAttribute;
}
exports.isDetailAttribute = isDetailAttribute;
function isSetAttribute(attribute) {
    return attribute instanceof ermodel_1.SetAttribute;
}
exports.isSetAttribute = isSetAttribute;
//# sourceMappingURL=utils.js.map