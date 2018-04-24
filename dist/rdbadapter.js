"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_64BIT_INT = -9223372036854775808;
exports.MAX_64BIT_INT = +9223372036854775807;
exports.MIN_32BIT_INT = -2147483648;
exports.MAX_32BIT_INT = +2147483647;
exports.MIN_16BIT_INT = -32768;
exports.MAX_16BIT_INT = +32767;
function relationName2Adapter(relationName) {
    return {
        relation: {
            relationName
        }
    };
}
exports.relationName2Adapter = relationName2Adapter;
function adapter2relationNames(a) {
    if (Array.isArray(a.relation)) {
        return a.relation.map(r => r.relationName);
    }
    else {
        return [a.relation.relationName];
    }
}
exports.adapter2relationNames = adapter2relationNames;
function sameAdapter(a, b) {
    return adapter2relationNames(a).join() === adapter2relationNames(b).join();
}
exports.sameAdapter = sameAdapter;
//# sourceMappingURL=rdbadapter.js.map