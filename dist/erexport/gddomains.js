"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const erm = __importStar(require("../ermodel"));
exports.gdDomains = {
    'DEDITIONDATE': (attributeName, lName, adapter) => new erm.TimeStampAttribute(attributeName, { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter),
    'DCREATIONDATE': (attributeName, lName, adapter) => new erm.TimeStampAttribute(attributeName, { ru: { name: 'Создано' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter),
    'DDOCUMENTDATE': (attributeName, lName, adapter) => new erm.TimeStampAttribute(attributeName, { ru: { name: 'Дата документа' } }, true, new Date('1900-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter),
    'DQUANTITY': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter),
    'DLAT': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 10, 8, -90, +90, undefined, adapter),
    'DLON': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 11, 8, -180, +180, undefined, adapter),
    'DCURRENCY': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter),
    'DPOSITIVE': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 15, 8, 0, undefined, undefined, adapter),
    'DPERCENT': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 7, 4, undefined, undefined, undefined, adapter),
    'DTAX': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 7, 4, 0, 99, undefined, adapter),
    'DDECDIGITS': (attributeName, lName, adapter) => new erm.IntegerAttribute(attributeName, lName, false, 0, 16, undefined, adapter),
    'DACCOUNTTYPE': (attributeName, lName, adapter) => new erm.EnumAttribute(attributeName, lName, false, [{ value: 'D' }, { value: 'K' }], undefined, adapter),
    'DGENDER': (attributeName, lName, adapter) => new erm.EnumAttribute(attributeName, lName, false, [{ value: 'M' }, { value: 'F' }, { value: 'N' }], undefined, adapter),
    'DTEXTALIGNMENT': (attributeName, lName, adapter) => new erm.EnumAttribute(attributeName, lName, false, [{ value: 'L' }, { value: 'R' }, { value: 'C' }, { value: 'J' }], 'L', adapter),
    'DSECURITY': (attributeName, lName, adapter) => new erm.IntegerAttribute(attributeName, lName, true, undefined, undefined, -1, adapter),
    'DDISABLED': (attributeName, lName, adapter) => new erm.BooleanAttribute(attributeName, lName, false, false, adapter),
    'DBOOLEAN': (attributeName, lName, adapter) => new erm.BooleanAttribute(attributeName, lName, false, false, adapter),
    'DBOOLEAN_NOTNULL': (attributeName, lName, adapter) => new erm.BooleanAttribute(attributeName, lName, true, false, adapter),
    // следующие домены надо проверить, возможно уже нигде и не используются
    'DTYPETRANSPORT': (attributeName, lName, adapter) => new erm.EnumAttribute(attributeName, lName, false, [{ value: 'C' }, { value: 'S' }, { value: 'R' }, { value: 'O' }, { value: 'W' }], undefined, adapter),
    'DGOLDQUANTITY': (attributeName, lName, adapter) => new erm.NumericAttribute(attributeName, lName, false, 15, 8, undefined, undefined, undefined, adapter),
    'GD_DIPADDRESS': (attributeName, lName, adapter) => new erm.StringAttribute(attributeName, lName, true, undefined, 15, undefined, true, /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}\/\d+/, adapter),
    'DSTORAGE_DATA_TYPE': (attributeName, lName, adapter) => new erm.EnumAttribute(attributeName, lName, true, [
        { value: 'G' }, { value: 'U' }, { value: 'O' }, { value: 'T' }, { value: 'F' },
        { value: 'S' }, { value: 'I' }, { value: 'C' }, { value: 'L' }, { value: 'D' },
        { value: 'B' }
    ], undefined, adapter)
};
//# sourceMappingURL=gddomains.js.map