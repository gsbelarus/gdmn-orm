"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
exports.MIN_64BIT_INT = -9223372036854775808;
exports.MAX_64BIT_INT = +9223372036854775807;
exports.MIN_32BIT_INT = -2147483648;
exports.MAX_32BIT_INT = +2147483647;
exports.MIN_16BIT_INT = -32768;
exports.MAX_16BIT_INT = +32767;
exports.systemFields = [
    "AVIEW",
    "ACHAG",
    "AFULL",
    "DISABLED",
    "CREATIONDATE",
    "CREATORKEY",
    "EDITIONDATE",
    "EDITORKEY"
];
function relationName2Adapter(relationName) {
    return {
        relation: [{
                relationName
            }]
    };
}
exports.relationName2Adapter = relationName2Adapter;
function relationNames2Adapter(relationNames) {
    return { relation: relationNames.map((relationName) => ({ relationName })) };
}
exports.relationNames2Adapter = relationNames2Adapter;
function appendAdapter(src, relationName) {
    const em = clone_1.default(src);
    if (relationName && !em.relation.find((r) => r.relationName === relationName)) {
        em.relation.push({ relationName });
    }
    return em;
}
exports.appendAdapter = appendAdapter;
function sameAdapter(mapA, mapB) {
    const arrA = mapA.relation.filter((r) => !r.weak);
    const arrB = mapB.relation.filter((r) => !r.weak);
    return arrA.length === arrB.length
        && arrA.every((a, idx) => a.relationName === arrB[idx].relationName
            && JSON.stringify(a.selector) === JSON.stringify(arrB[idx].selector));
}
exports.sameAdapter = sameAdapter;
function hasField(em, rn, fn) {
    const r = em.relation.find((ar) => ar.relationName === rn);
    if (!r) {
        throw new Error(`Can't find relation ${rn} in adapter`);
    }
    return !r.fields || !!r.fields.find((f) => f === fn);
}
exports.hasField = hasField;
function isUserDefined(name) {
    return name.substring(0, 4) === "USR$";
}
exports.isUserDefined = isUserDefined;
function condition2Selectors(cond) {
    // conditions like field_name = some_int_value
    const matchA = /([A-Za-z_0-9]+)\s*=\s*([0-9]+)/.exec(cond);
    if (matchA) {
        return [
            {
                field: matchA[1].toUpperCase(),
                value: Number.parseInt(matchA[2], 10)
            }
        ];
    }
    // conditions like field_name in (some_int_value_1 [, some_int_value_2...])
    const matchB = /([A-Za-z_0-9]+)\s+IN\s*\(([0-9,]+)\)/i.exec(cond);
    if (matchB) {
        const regExpC = /([0-9]+)/g;
        const values = matchB[2];
        const result = [];
        let matchC = regExpC.exec(values);
        while (matchC) {
            result.push({ field: matchB[1].toUpperCase(), value: Number.parseInt(matchC[0], 10) });
            matchC = regExpC.exec(values);
        }
        return result;
    }
    return [];
}
exports.condition2Selectors = condition2Selectors;
function adjustName(relationName) {
    // return relationName.replace('$', '_');
    return relationName;
}
exports.adjustName = adjustName;
//# sourceMappingURL=rdbadapter.js.map