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
function adapter2relationNames(em) {
    return adapter2array(em).map(r => r.relationName);
}
exports.adapter2relationNames = adapter2relationNames;
function sameAdapter(a, b) {
    const arrA = adapter2array(a);
    const arrB = adapter2array(b);
    return arrA.length === arrB.length
        && arrA.every((a, idx) => idx < arrB.length && a.relationName === arrB[idx].relationName
            && JSON.stringify(a.selector) === JSON.stringify(arrB[idx].selector));
}
exports.sameAdapter = sameAdapter;
function hasField(em, rn, fn) {
    let r;
    if (Array.isArray(em.relation)) {
        r = em.relation.find(rel => rel.relationName === rn);
    }
    else {
        if (em.relation.relationName === rn) {
            r = em.relation;
        }
    }
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
//# sourceMappingURL=rdbadapter.js.map