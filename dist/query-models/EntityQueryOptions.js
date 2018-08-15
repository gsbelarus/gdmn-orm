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
    static inspectorToObject(link, inspector) {
        return new EntityQueryOptions(inspector.first, inspector.skip, EntityQueryOptions.inspectorWhereToObject(link, inspector.where), EntityQueryOptions._inspectorToObjectMap(link, inspector.order));
    }
    static inspectorWhereToObject(link, inspector) {
        if (inspector) {
            const where = {};
            const not = EntityQueryOptions.inspectorWhereToObject(link, inspector.not);
            if (not) {
                where.not = not;
            }
            const or = EntityQueryOptions.inspectorWhereToObject(link, inspector.or);
            if (or) {
                where.or = or;
            }
            const and = EntityQueryOptions.inspectorWhereToObject(link, inspector.and);
            if (and) {
                where.and = and;
            }
            if (inspector.isNull) {
                const isNull = Object.entries(inspector.isNull).reduce((aliases, [alias, value]) => {
                    const findLink = link.deepFindLinkByAlias(alias);
                    if (!findLink) {
                        throw new Error("Alias not found");
                    }
                    aliases[alias] = findLink.entity.attribute(value);
                    return aliases;
                }, {});
                if (Object.keys(isNull).length) {
                    where.isNull = isNull;
                }
            }
            const equals = EntityQueryOptions._inspectorToObjectMap(link, inspector.equals);
            if (equals) {
                where.equals = equals;
            }
            const greater = EntityQueryOptions._inspectorToObjectMap(link, inspector.greater);
            if (greater) {
                where.greater = greater;
            }
            const less = EntityQueryOptions._inspectorToObjectMap(link, inspector.less);
            if (less) {
                where.less = less;
            }
            return where;
        }
    }
    static _inspectorToObjectMap(link, map) {
        if (map) {
            return Object.entries(map)
                .reduce((aliases, [alias, condition]) => {
                const findLink = link.deepFindLinkByAlias(alias);
                if (!findLink) {
                    throw new Error("Alias not found");
                }
                aliases[alias] = Object.entries(condition)
                    .reduce((newMap, [key, value]) => {
                    newMap.set(findLink.entity.attribute(key), value);
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
        const options = {};
        if (this.first !== undefined) {
            options.first = this.first;
        }
        if (this.skip !== undefined) {
            options.skip = this.skip;
        }
        const where = EntityQueryOptions._inspectWhere(this.where);
        if (where) {
            options.where = where;
        }
        const order = EntityQueryOptions._inspectMap(this.order);
        if (order) {
            options.order = order;
        }
        return options;
    }
}
exports.EntityQueryOptions = EntityQueryOptions;
//# sourceMappingURL=EntityQueryOptions.js.map