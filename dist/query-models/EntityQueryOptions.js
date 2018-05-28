"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityQueryOrder;
(function (EntityQueryOrder) {
    EntityQueryOrder["ASC"] = "asc";
    EntityQueryOrder["DESC"] = "desc";
})(EntityQueryOrder = exports.EntityQueryOrder || (exports.EntityQueryOrder = {}));
class EntityQueryOptions {
    constructor(first, skip, where, order) {
        this.first = first;
        this.skip = skip;
        this.where = where;
        this.order = order;
    }
    static inspectorToObject(entity, inspector) {
        return new EntityQueryOptions(inspector.first, inspector.skip, EntityQueryOptions.inspectorWhereToObject(entity, inspector.where), EntityQueryOptions._inspectorToObjectMap(entity, inspector.order));
    }
    static inspectorWhereToObject(entity, inspector) {
        if (inspector) {
            const where = {};
            const not = EntityQueryOptions.inspectorWhereToObject(entity, inspector.not);
            if (not) {
                where.not = not;
            }
            const or = EntityQueryOptions.inspectorWhereToObject(entity, inspector.or);
            if (or) {
                where.or = or;
            }
            const and = EntityQueryOptions.inspectorWhereToObject(entity, inspector.and);
            if (and) {
                where.and = and;
            }
            if (inspector.isNull) {
                const isNull = Object.entries(inspector.isNull).reduce((aliases, [alias, value]) => {
                    aliases[alias] = entity.attribute(value);
                    return aliases;
                }, {});
                if (Object.keys(isNull).length) {
                    where.isNull = isNull;
                }
            }
            const equals = EntityQueryOptions._inspectorToObjectMap(entity, inspector.equals);
            if (equals) {
                where.equals = equals;
            }
            const greater = EntityQueryOptions._inspectorToObjectMap(entity, inspector.greater);
            if (greater) {
                where.greater = greater;
            }
            const less = EntityQueryOptions._inspectorToObjectMap(entity, inspector.less);
            if (less) {
                where.less = less;
            }
            return where;
        }
    }
    static _inspectorToObjectMap(entity, map) {
        if (map) {
            return Object.entries(map)
                .reduce((aliases, [alias, condition]) => {
                aliases[alias] = Object.entries(condition)
                    .reduce((newMap, [key, value]) => {
                    newMap.set(entity.attribute(key), value);
                    return newMap;
                }, new Map());
                return aliases;
            }, {});
        }
        return {};
    }
    static _inspectMap(map) {
        if (map) {
            return Object.entries(map).reduce((aliases, [alias, condition]) => {
                const newMap = {};
                for (const [key, value] of condition.entries()) {
                    newMap[key.name] = value;
                }
                aliases[alias] = newMap;
                return aliases;
            }, {});
        }
        return {};
    }
    static _inspectWhere(where) {
        if (where) {
            const inspector = {};
            if (where.not) {
                inspector.not = this._inspectWhere(where.not);
            }
            if (where.or) {
                inspector.or = this._inspectWhere(where.or);
            }
            if (where.and) {
                inspector.and = this._inspectWhere(where.and);
            }
            if (where.isNull) {
                inspector.isNull = Object.entries(where.isNull).reduce((isNull, [alias, value]) => {
                    isNull[alias] = value.name;
                    return isNull;
                }, {});
            }
            const equals = EntityQueryOptions._inspectMap(where.equals);
            if (Object.keys(equals).length) {
                inspector.equals = equals;
            }
            const greater = EntityQueryOptions._inspectMap(where.greater);
            if (Object.keys(greater).length) {
                inspector.greater = greater;
            }
            const less = EntityQueryOptions._inspectMap(where.less);
            if (Object.keys(less).length) {
                inspector.less = less;
            }
            return inspector;
        }
    }
    inspect() {
        return {
            first: this.first,
            skip: this.skip,
            where: EntityQueryOptions._inspectWhere(this.where),
            order: EntityQueryOptions._inspectMap(this.order)
        };
    }
}
exports.EntityQueryOptions = EntityQueryOptions;
//# sourceMappingURL=EntityQueryOptions.js.map