export interface TName {
  name: string;
  fullName?: string;
}

export interface LName {
  ru?: TName;
  by?: TName;
  en?: TName;
}

export interface EnumValue {
  value: string | number;
  lName?: LName;
}

export interface AttributeAdapter { }

export interface EntityAdapter { }

export interface SequenceAdapter { }