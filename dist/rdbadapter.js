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
function adapter2relationNames(em) {
    if (Array.isArray(em.relation)) {
        if (!em.relation.length) {
            throw new Error('Invalid entity 2 relation adapter');
        }
        return em.relation.map(r => r.relationName);
    }
    else {
        return [em.relation.relationName];
    }
}
exports.adapter2relationNames = adapter2relationNames;
function sameAdapter(a, b) {
    return adapter2relationNames(a).join() === adapter2relationNames(b).join();
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
    const result = !r.fields || !r.fields.length || !!r.fields.find(f => f === fn);
    if (r.fields) {
        console.log(r.fields.join());
        console.log(fn);
        console.log(result);
    }
    return result;
}
exports.hasField = hasField;
//# sourceMappingURL=rdbadapter.js.map