"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const gdmn_db_1 = require("gdmn-db");
const erm = __importStar(require("../ermodel"));
const rdbadapter = __importStar(require("../rdbadapter"));
const atdata_1 = require("./atdata");
const util_1 = require("./util");
async function erExport(dbs, transaction, erModel) {
    const { atfields, atrelations } = await atdata_1.load(transaction);
    /**
     * Если имя генератора совпадает с именем объекта в БД, то адаптер можем не указывать.
     */
    const GDGUnique = erModel.addSequence(new erm.Sequence('GD_G_UNIQUE'));
    const GDGOffset = erModel.addSequence(new erm.Sequence('Offset', { sequence: 'GD_G_OFFSET' }));
    function findEntities(relationName, selectors = []) {
        const found = Object.entries(erModel.entities).reduce((p, e) => {
            if (e[1].adapter) {
                rdbadapter.adapter2array(e[1].adapter).forEach(r => {
                    if (r.relationName === relationName && !rdbadapter.isWeakRelation(r)) {
                        if (r.selector && selectors.length) {
                            if (selectors.find(s => s.field === r.selector.field && s.value === r.selector.value)) {
                                p.push(e[1]);
                            }
                        }
                        else {
                            p.push(e[1]);
                        }
                    }
                });
            }
            return p;
        }, []);
        while (found.length) {
            const descendant = found.findIndex(d => !!found.find(a => a !== d && d.hasAncestor(a)));
            if (descendant === -1)
                break;
            found.splice(descendant, 1);
        }
        return found;
    }
    function createEntity(parent, adapter, entityName, lName, attributes) {
        const found = Object.entries(erModel.entities).find(e => rdbadapter.sameAdapter(adapter, e[1].adapter));
        if (found) {
            return found[1];
        }
        const relation = rdbadapter.adapter2array(adapter).filter(r => !rdbadapter.isWeakRelation(r)).reverse()[0];
        if (!relation || !relation.relationName) {
            throw new Error('Invalid entity adapter');
        }
        const setEntityName = entityName ? entityName : relation.relationName;
        const atRelation = atrelations[relation.relationName];
        const fake = rdbadapter.relationName2Adapter(setEntityName);
        const entity = new erm.Entity(parent, setEntityName, lName ? lName : (atRelation ? atRelation.lName : {}), false, JSON.stringify(adapter) !== JSON.stringify(fake) ? adapter : undefined);
        if (!parent) {
            entity.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
        }
        ;
        if (attributes) {
            attributes.forEach(attr => entity.add(attr));
        }
        return erModel.add(entity);
    }
    ;
    /**
     * Простейший случай таблицы. Никаких ссылок.
     */
    createEntity(undefined, rdbadapter.relationName2Adapter('WG_HOLIDAY'));
    /**
     * Административно-территориальная единица.
     * Тут исключительно для иллюстрации типа данных Перечисление.
     */
    createEntity(undefined, rdbadapter.relationName2Adapter('GD_PLACE'), undefined, undefined, [
        new erm.EnumAttribute('PLACETYPE', { ru: { name: 'Тип' } }, true, [
            {
                value: 'Область'
            },
            {
                value: 'Район'
            },
        ], 'Область')
    ]);
    /**
     * Папка из справочника контактов.
     * Основывается на таблице GD_CONTACT, но использует только несколько полей из нее.
     * Записи имеют признак CONTACTTYPE = 0.
     * Имеет древовидную структуру.
     */
    const Folder = createEntity(undefined, {
        relation: {
            relationName: 'GD_CONTACT',
            selector: {
                field: 'CONTACTTYPE',
                value: 0,
            },
            fields: [
                'PARENT',
                'NAME'
            ]
        }
    }, 'Folder', { ru: { name: 'Папка' } });
    Folder.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    /**
     * Компания хранится в трех таблицах.
     * Две обязательные GD_CONTACT - GD_COMPANY. В адаптере они указываются
     * в массиве relation и соединяются в запросе оператором JOIN.
     * Первой указывается главная таблица. Остальные таблицы называются
     * дополнительными. Первичный ключ дополнительной таблицы
     * должен одновременно являться внешним ключем на главную.
     * Третья -- GD_COMPANYCODE -- необязательная. Подключается через LEFT JOIN.
     * Для атрибутов из главной таблицы можно не указывать адаптер, если их имя
     * совпадает с именем поля.
     * Флаг refresh означает, что после вставки/изменения записи ее надо перечитать.
     */
    const Company = createEntity(undefined, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                selector: {
                    field: 'CONTACTTYPE',
                    value: 3
                }
            },
            {
                relationName: 'GD_COMPANY'
            },
            {
                relationName: 'GD_COMPANYCODE',
                weak: true
            }
        ],
        refresh: true
    }, 'Company', { ru: { name: 'Организация' } }, [
        new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]),
        new erm.StringAttribute('NAME', { ru: { name: 'Краткое наименование' } }, true, undefined, 60, undefined, true, undefined)
    ]);
    /**
     * Банк является частным случаем компании (наследуется от компании).
     * Все атрибуты компании являются и атрибутами банка и не нуждаются
     * в повторном определении, за тем исключением, если мы хотим что-то
     * поменять в параметрах атрибута.
     */
    const Bank = createEntity(Company, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                selector: {
                    field: 'CONTACTTYPE',
                    value: 5
                }
            },
            {
                relationName: 'GD_COMPANY'
            },
            {
                relationName: 'GD_COMPANYCODE',
                weak: true
            },
            {
                relationName: 'GD_BANK'
            }
        ],
        refresh: true
    }, 'Bank', { ru: { name: 'Банк' } });
    /**
     * Подразделение организации может входить (через поле Parent) в
     * организацию (компания, банк) или в другое подразделение.
     */
    const Department = createEntity(undefined, {
        relation: {
            relationName: 'GD_CONTACT',
            selector: {
                field: 'CONTACTTYPE',
                value: 4
            }
        }
    }, 'Department', { ru: { name: 'Подразделение' } });
    Department.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в организацию (подразделение)' } }, [Company, Department]));
    Department.add(new erm.StringAttribute('NAME', { ru: { name: 'Наименование' } }, true, undefined, 60, undefined, true, undefined));
    /**
     * Физическое лицо хранится в двух таблицах GD_CONTACT - GD_PEOPLE.
     */
    const Person = createEntity(undefined, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                selector: {
                    field: 'CONTACTTYPE',
                    value: 2
                }
            },
            {
                relationName: 'GD_PEOPLE'
            }
        ],
        refresh: true
    }, 'Person', { ru: { name: 'Физическое лицо' } });
    Person.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    Person.add(new erm.StringAttribute('NAME', { ru: { name: 'ФИО' } }, true, undefined, 60, undefined, true, undefined));
    /**
     * Сотрудник, частный случай физического лица.
     * Добавляется таблица GD_EMPLOYEE.
     */
    const Employee = createEntity(Person, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                selector: {
                    field: 'CONTACTTYPE',
                    value: 2
                }
            },
            {
                relationName: 'GD_PEOPLE'
            },
            {
                relationName: 'GD_EMPLOYEE'
            }
        ]
    }, 'Employee', { ru: { name: 'Сотрудник предприятия' } });
    Employee.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Организация или подразделение' } }, [Company, Department]));
    /**
     * Группа контактов.
     * CONTACTLIST -- множество, которое хранится в кросс-таблице.
     */
    const Group = createEntity(undefined, {
        relation: {
            relationName: 'GD_CONTACT',
            selector: {
                field: 'CONTACTTYPE',
                value: 1
            }
        }
    }, 'Group', { ru: { name: 'Группа' } });
    Group.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    const ContactList = Group.add(new erm.SetAttribute('CONTACTLIST', { ru: { name: 'Контакты' } }, false, [Company, Person], {
        crossRelation: 'GD_CONTACTLIST'
    }));
    dbs.forEachRelation(r => {
        if (r.primaryKey && r.primaryKey.fields.join() === 'ID' && /^USR\$.+$/.test(r.name)) {
            createEntity(undefined, rdbadapter.relationName2Adapter(r.name));
        }
    });
    /**
     * @todo Parse fields CHECK constraint and extract min and max allowed values.
     */
    function createAttributes(entity) {
        const adapterArr = rdbadapter.adapter2array(entity.adapter);
        const relations = adapterArr.map(rn => dbs.relations[rn.relationName]);
        relations.forEach(r => {
            if (!r || !r.primaryKey)
                return;
            const atRelation = atrelations[r.name];
            Object.entries(r.relationFields).forEach(rf => {
                if (r.primaryKey.fields.find(f => f === rf[0]))
                    return;
                if (rf[0] === 'LB' || rf[0] === 'RB')
                    return;
                if (entity.hasAttribute(rf[0]))
                    return;
                if (!rdbadapter.hasField(entity.adapter, r.name, rf[0])
                    && !rdbadapter.systemFields.find(sf => sf === rf[0])
                    && !rdbadapter.isUserDefined(rf[0])) {
                    return;
                }
                if (adapterArr[0].selector && adapterArr[0].selector.field === rf[0]) {
                    return;
                }
                const atField = atfields[rf[1].fieldSource];
                const atRelationField = atRelation ? atRelation.relationFields[rf[1].name] : undefined;
                const attributeName = entity.hasAttribute(rf[0]) ? `${r.name}.${rf[0]}` : rf[0];
                const fieldSource = dbs.fields[rf[1].fieldSource];
                const lName = atRelationField ? atRelationField.lName : (atField ? atField.lName : {});
                const required = rf[1].notNull || fieldSource.notNull;
                const defaultValue = rf[1].defaultValue || fieldSource.defaultValue;
                const adapter = relations.length > 1 ? { relation: r.name, field: rf[0] } : undefined;
                const attr = (() => {
                    switch (rf[1].fieldSource) {
                        case 'DEDITIONDATE':
                            return new erm.TimeStampAttribute(attributeName, { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter);
                        case 'DCREATIONDATE':
                            return new erm.TimeStampAttribute(attributeName, { ru: { name: 'Создано' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter);
                        case 'DDOCUMENTDATE':
                            return new erm.TimeStampAttribute(attributeName, { ru: { name: 'Дата документа' } }, true, new Date('1900-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)', adapter);
                        case 'DQUANTITY': return new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter);
                        case 'DLAT': return new erm.NumericAttribute(attributeName, lName, false, 10, 8, -90, +90, undefined, adapter);
                        case 'DLON': return new erm.NumericAttribute(attributeName, lName, false, 11, 8, -180, +180, undefined, adapter);
                        case 'DCURRENCY': return new erm.NumericAttribute(attributeName, lName, false, 15, 4, undefined, undefined, undefined, adapter);
                        case 'DPOSITIVE': return new erm.NumericAttribute(attributeName, lName, false, 15, 8, 0, undefined, undefined, adapter);
                        case 'DPERCENT': return new erm.NumericAttribute(attributeName, lName, false, 7, 4, undefined, undefined, undefined, adapter);
                        case 'DTAX': return new erm.NumericAttribute(attributeName, lName, false, 7, 4, 0, 99, undefined, adapter);
                        case 'DDECDIGITS': return new erm.IntegerAttribute(attributeName, lName, false, 0, 16, undefined, adapter);
                        case 'DACCOUNTTYPE': return new erm.EnumAttribute(attributeName, lName, false, [{ value: 'D' }, { value: 'K' }], undefined, adapter);
                        case 'DGENDER': return new erm.EnumAttribute(attributeName, lName, false, [{ value: 'M' }, { value: 'F' }, { value: 'N' }], undefined, adapter);
                        case 'DTEXTALIGNMENT': return new erm.EnumAttribute(attributeName, lName, false, [{ value: 'L' }, { value: 'R' }, { value: 'C' }, { value: 'J' }], 'L', adapter);
                        case 'DSECURITY': return new erm.IntegerAttribute(attributeName, lName, true, undefined, undefined, -1, adapter);
                        case 'DDISABLED': return new erm.BooleanAttribute(attributeName, lName, false, false, adapter);
                        case 'DBOOLEAN': return new erm.BooleanAttribute(attributeName, lName, false, false, adapter);
                        case 'DBOOLEAN_NOTNULL': return new erm.BooleanAttribute(attributeName, lName, true, false, adapter);
                        // следующие домены надо проверить, возможно уже нигде и не используются
                        case 'DTYPETRANSPORT': return new erm.EnumAttribute(attributeName, lName, false, [{ value: 'C' }, { value: 'S' }, { value: 'R' }, { value: 'O' }, { value: 'W' }], undefined, adapter);
                        case 'DGOLDQUANTITY': return new erm.NumericAttribute(attributeName, lName, false, 15, 8, undefined, undefined, undefined, adapter);
                    }
                    if (fieldSource.fieldScale < 0) {
                        const factor = Math.pow(10, fieldSource.fieldScale);
                        let MaxValue;
                        let MinValue;
                        switch (fieldSource.fieldType) {
                            case gdmn_db_1.FieldType.SMALL_INTEGER:
                                MaxValue = rdbadapter.MAX_16BIT_INT * factor;
                                MinValue = rdbadapter.MIN_16BIT_INT * factor;
                                break;
                            case gdmn_db_1.FieldType.INTEGER:
                                MaxValue = rdbadapter.MAX_32BIT_INT * factor;
                                MinValue = rdbadapter.MIN_32BIT_INT * factor;
                                break;
                            default:
                                MaxValue = rdbadapter.MAX_64BIT_INT * factor;
                                MinValue = rdbadapter.MIN_64BIT_INT * factor;
                        }
                        return new erm.NumericAttribute(attributeName, lName, required, fieldSource.fieldPrecision, fieldSource.fieldScale, MinValue, MaxValue, util_1.default2Number(defaultValue), adapter);
                    }
                    switch (fieldSource.fieldType) {
                        case gdmn_db_1.FieldType.INTEGER:
                            {
                                const fk = Object.entries(r.foreignKeys).find(f => !!f[1].fields.find(fld => fld === attributeName));
                                if (fk && fk[1].fields.length === 1) {
                                    const refRelationName = dbs.relationByUqConstraint(fk[1].constNameUq).name;
                                    const cond = atField && atField.refCondition ? rdbadapter.condition2Selectors(atField.refCondition) : undefined;
                                    const refEntities = findEntities(refRelationName, cond);
                                    if (!refEntities.length) {
                                        throw new Error(`No entities for table ${refRelationName}, condition: ${JSON.stringify(cond)}`);
                                    }
                                    return new erm.EntityAttribute(attributeName, lName, required, refEntities, adapter);
                                }
                                else {
                                    return new erm.IntegerAttribute(attributeName, lName, required, rdbadapter.MIN_32BIT_INT, rdbadapter.MAX_32BIT_INT, util_1.default2Int(defaultValue), adapter);
                                }
                            }
                        case gdmn_db_1.FieldType.CHAR:
                        case gdmn_db_1.FieldType.VARCHAR:
                            {
                                if (fieldSource.fieldLength === 1 && fieldSource.validationSource) {
                                    const enumValues = [];
                                    const reValueIn = /CHECK\s*\((\(VALUE IS NULL\) OR )?(\(VALUE\s+IN\s*\(\s*){1}((?:\'[A-Z0-9]\'(?:\,\s*)?)+)\)\)\)/;
                                    let match;
                                    if (match = reValueIn.exec(fieldSource.validationSource)) {
                                        const reEnumValue = /\'([A-Z0-9]{1})\'/g;
                                        let enumValue;
                                        while (enumValue = reEnumValue.exec(match[3])) {
                                            enumValues.push({ value: enumValue[1] });
                                        }
                                    }
                                    if (enumValues.length) {
                                        return new erm.EnumAttribute(attributeName, lName, required, enumValues, undefined, adapter);
                                    }
                                    else {
                                        console.log(JSON.stringify(fieldSource.validationSource));
                                    }
                                }
                                return new erm.StringAttribute(attributeName, lName, required, undefined, fieldSource.fieldLength, undefined, true, undefined, adapter);
                            }
                        case gdmn_db_1.FieldType.TIMESTAMP:
                            return new erm.TimeStampAttribute(attributeName, lName, required, undefined, undefined, util_1.default2Date(defaultValue), adapter);
                        case gdmn_db_1.FieldType.DATE:
                            return new erm.DateAttribute(attributeName, lName, required, undefined, undefined, util_1.default2Date(defaultValue), adapter);
                        case gdmn_db_1.FieldType.TIME:
                            return new erm.TimeAttribute(attributeName, lName, required, undefined, undefined, util_1.default2Date(defaultValue), adapter);
                        case gdmn_db_1.FieldType.FLOAT:
                        case gdmn_db_1.FieldType.DOUBLE:
                            return new erm.FloatAttribute(attributeName, lName, required, undefined, undefined, util_1.default2Number(defaultValue), adapter);
                        case gdmn_db_1.FieldType.SMALL_INTEGER:
                            return new erm.IntegerAttribute(attributeName, lName, required, rdbadapter.MIN_16BIT_INT, rdbadapter.MAX_16BIT_INT, util_1.default2Int(defaultValue), adapter);
                        case gdmn_db_1.FieldType.BIG_INTEGER:
                            return new erm.IntegerAttribute(attributeName, lName, required, rdbadapter.MIN_64BIT_INT, rdbadapter.MAX_64BIT_INT, util_1.default2Int(defaultValue), adapter);
                        case gdmn_db_1.FieldType.BLOB:
                            if (fieldSource.fieldSubType === 1) {
                                return new erm.StringAttribute(attributeName, lName, required, undefined, undefined, undefined, false, undefined, adapter);
                            }
                            else {
                                return new erm.BLOBAttribute(attributeName, lName, required, adapter);
                            }
                        default:
                            console.log(`Unknown data type ${fieldSource}=${fieldSource.fieldType} for field ${r.name}.${attributeName}`);
                            return undefined;
                        // throw new Error('Unknown data type for field ' + r.name + '.' + attributeName);
                    }
                })();
                if (attr) {
                    entity.add(attr);
                }
            });
            Object.entries(r.unique).forEach(uq => {
                entity.addUnique(uq[1].fields.map(f => entity.attribute(f)));
            });
        });
    }
    Object.entries(erModel.entities).forEach(e => createAttributes(e[1]));
    return erModel;
}
exports.erExport = erExport;
//# sourceMappingURL=index.js.map