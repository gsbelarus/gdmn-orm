import {
    Attribute,
    BlobAttribute,
    BooleanAttribute,
    DateAttribute,
    DetailAttribute,
    EntityAttribute,
    EnumAttribute,
    FloatAttribute,
    IntegerAttribute,
    NumberAttribute,
    NumericAttribute,
    ParentAttribute,
    ScalarAttribute,
    SequenceAttribute,
    SetAttribute,
    StringAttribute,
    TimeAttribute,
    TimeIntervalAttribute,
    TimeStampAttribute
} from "./ermodel";

export function isScalarAttribute(attribute: Attribute): attribute is ScalarAttribute {
  return attribute instanceof ScalarAttribute;
}

export function isStringAttribute(attribute: Attribute): attribute is StringAttribute {
  return attribute instanceof StringAttribute;
}

export function isSequenceAttribute(attribute: Attribute): attribute is SequenceAttribute {
  return attribute instanceof SequenceAttribute;
}

export function isNumberAttribute(attribute: Attribute): attribute is NumberAttribute<number> {
  return attribute instanceof NumberAttribute;
}

export function isIntegerAttribute(attribute: Attribute): attribute is IntegerAttribute {
  return attribute instanceof IntegerAttribute;
}

export function isFloatAttribute(attribute: Attribute): attribute is FloatAttribute {
  return attribute instanceof FloatAttribute;
}

export function isNumericAttribute(attribute: Attribute): attribute is NumericAttribute {
  return attribute instanceof NumericAttribute;
}

export function isDateAttribute(attribute: Attribute): attribute is DateAttribute {
  return attribute instanceof DateAttribute;
}

export function isTimeAttribute(attribute: Attribute): attribute is TimeAttribute {
  return attribute instanceof TimeAttribute;
}

export function isTimeStampAttribute(attribute: Attribute): attribute is TimeStampAttribute {
  return attribute instanceof TimeStampAttribute;
}

export function isBooleanAttribute(attribute: Attribute): attribute is BooleanAttribute {
  return attribute instanceof BooleanAttribute;
}

export function isBlobAttribute(attribute: Attribute): attribute is BlobAttribute {
  return attribute instanceof BlobAttribute;
}

export function isEnumAttribute(attribute: Attribute): attribute is EnumAttribute {
  return attribute instanceof EnumAttribute;
}

export function isTimeIntervalAttribute(attribute: Attribute): attribute is TimeIntervalAttribute {
  return attribute instanceof TimeIntervalAttribute;
}

export function isEntityAttribute(attribute: Attribute): attribute is EntityAttribute {
  return attribute instanceof EntityAttribute;
}

export function isParentAttribute(attribute: Attribute): attribute is ParentAttribute {
  return attribute instanceof ParentAttribute;
}

export function isDetailAttribute(attribute: Attribute): attribute is DetailAttribute {
  return attribute instanceof DetailAttribute;
}

export function isSetAttribute(attribute: Attribute): attribute is SetAttribute {
  return attribute instanceof SetAttribute;
}
