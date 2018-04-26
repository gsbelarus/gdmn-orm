"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_64BIT_INT = -9223372036854775808;
exports.MAX_64BIT_INT = +9223372036854775807;
exports.MIN_32BIT_INT = -2147483648;
exports.MAX_32BIT_INT = +2147483647;
exports.MIN_16BIT_INT = -32768;
exports.MAX_16BIT_INT = +32767;
exports.systemFields = [
    'AVIEW',
    'ACHAG',
    'AFULL',
    'DISABLED',
    'CREATIONDATE',
    'CREATORKEY',
    'EDITIONDATE',
    'EDITORKEY'
];
function isWeakRelation(r) {
    return typeof r.weak !== 'undefined';
}
exports.isWeakRelation = isWeakRelation;
function relationName2Adapter(relationName) {
    return {
        relation: {
            relationName
        }
    };
}
exports.relationName2Adapter = relationName2Adapter;
function adapter2array(em) {
    if (Array.isArray(em.relation)) {
        if (!em.relation.length) {
            throw new Error('Invalid entity 2 relation adapter');
        }
        return em.relation;
    }
    else {
        return [em.relation];
    }
}
exports.adapter2array = adapter2array;
function sameAdapter(mapA, mapB) {
    const arrA = adapter2array(mapA);
    const arrB = adapter2array(mapB);
    return arrA.length === arrB.length
        && arrA.every((a, idx) => a.relationName === arrB[idx].relationName
            && JSON.stringify(a.selector) === JSON.stringify(arrB[idx].selector));
}
exports.sameAdapter = sameAdapter;
function hasField(em, rn, fn) {
    const r = adapter2array(em).find(ar => ar.relationName === rn);
    if (!r) {
        throw new Error(`Can't find relation ${rn} in adapter`);
    }
    return !r.fields || !!r.fields.find(f => f === fn);
}
exports.hasField = hasField;
function isUserDefined(name) {
    return name.substring(0, 4) === 'USR$';
}
exports.isUserDefined = isUserDefined;
function condition2Selectors(cond) {
    // conditions like field_name = some_int_value
    const matchA = /([A-Za-z_0-9]+)\s*=\s*([0-9]+)/.exec(cond);
    if (matchA) {
        return [
            {
                field: matchA[1],
                value: matchA[2]
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
            result.push({ field: matchB[1], value: matchC[0] });
            matchC = regExpC.exec(values);
        }
        return result;
    }
    return [];
}
exports.condition2Selectors = condition2Selectors;
//# sourceMappingURL=rdbadapter.js.map