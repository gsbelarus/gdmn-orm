"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultTransaction {
    constructor() {
        this.finished = false;
    }
    async commit() {
        this.finished = true;
    }
    async rollback() {
        this.finished = true;
    }
}
exports.DefaultTransaction = DefaultTransaction;
//# sourceMappingURL=DefaultTransaction.js.map