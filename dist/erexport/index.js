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
    /**
     * Папка из справочника контактов.
     * Основывается на таблице GD_CONTACT, но использует только несколько полей из нее.
     * Записи имеют признак CONTACTTYPE = 0.
     * Имеет древовидную структуру.
     */
    const Folder = erModel.add(new erm.Entity(undefined, 'Folder', { ru: { name: 'Папка' } }, false, {
        relation: {
            relationName: 'GD_CONTACT',
            structure: 'LBRB',
            selector: {
                field: 'CONTACTTYPE',
                value: 0
            }
        }
    }));
    Folder.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Folder.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    Folder.add(new erm.StringAttribute('NAME', { ru: { name: 'Наименование' } }, true, undefined, 60, undefined, true, undefined));
    Folder.add(new erm.TimeStampAttribute('EDITIONDATE', { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'));
    Folder.add(new erm.BooleanAttribute('DISABLED', { ru: { name: 'Отключено' } }, true, false));
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
    const Company = erModel.add(new erm.Entity(undefined, 'Company', { ru: { name: 'Организация' } }, false, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                structure: 'LBRB',
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
    }));
    Company.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Company.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    Company.add(new erm.StringAttribute('NAME', { ru: { name: 'Краткое наименование' } }, true, undefined, 60, undefined, true, undefined));
    Company.add(new erm.StringAttribute('PHONE', { ru: { name: 'Номер телефона' } }, true, undefined, 40, undefined, true, /^[\d+-,]{7,40}$/));
    Company.add(new erm.StringAttribute('FULLNAME', { ru: { name: 'Полное наименование' } }, true, undefined, 180, undefined, true, undefined, {
        relation: 'GD_COMPANY'
    }));
    Company.add(new erm.StringAttribute('TAXID', { ru: { name: 'УНП' } }, false, undefined, 9, undefined, true, /^[\d]{9}$/, {
        relation: 'GD_COMPANYCODE'
    }));
    /**
     * Банк является частным случаем компании (наследуется от компании).
     * В адаптере мы указываем только те таблицы (значения), которые
     * отличаются от родителя. Результирующий адаптер получается слиянием
     * родительского адаптера и текущего.
     * Все атрибуты компании являются и атрибутами банка и не нуждаются
     * в повторном определении, за тем исключением, если мы хотим что-то
     * поменять в параметрах атрибута.
     */
    const Bank = erModel.add(new erm.Entity(Company, 'Bank', { ru: { name: 'Банк' } }, false, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                selector: {
                    field: 'CONTACTTYPE',
                    value: 5
                }
            },
            {
                relationName: 'GD_BANK'
            }
        ],
        refresh: true
    }));
    Bank.add(new erm.StringAttribute('BANKCODE', { ru: { name: 'Код банка' } }, true, undefined, 20, undefined, true, undefined, {
        relation: 'GD_BANK'
    }));
    /**
     * Подразделение организации может входить (через поле Parent) в
     * организацию (компания, банк) или в другое подразделение.
     */
    const Department = erModel.add(new erm.Entity(undefined, 'Department', { ru: { name: 'Подразделение' } }, false, {
        relation: {
            relationName: 'GD_CONTACT',
            structure: 'LBRB',
            selector: {
                field: 'CONTACTTYPE',
                value: 4
            }
        }
    }));
    Department.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Department.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в организацию (подразделение)' } }, [Company, Department]));
    Department.add(new erm.StringAttribute('NAME', { ru: { name: 'Наименование' } }, true, undefined, 60, undefined, true, undefined));
    Department.add(new erm.TimeStampAttribute('EDITIONDATE', { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'));
    Department.add(new erm.BooleanAttribute('DISABLED', { ru: { name: 'Отключено' } }, true, false));
    /**
     * Физическое лицо хранится в двух таблицах GD_CONTACT - GD_PEOPLE.
     */
    const Person = erModel.add(new erm.Entity(undefined, 'Person', { ru: { name: 'Физическое лицо' } }, false, {
        relation: [
            {
                relationName: 'GD_CONTACT',
                structure: 'LBRB',
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
    }));
    Person.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Person.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    Person.add(new erm.StringAttribute('NAME', { ru: { name: 'ФИО' } }, true, undefined, 60, undefined, true, undefined));
    Person.add(new erm.StringAttribute('PHONE', { ru: { name: 'Номер телефона' } }, true, undefined, 40, undefined, true, /^[\d+-,]{7,40}$/));
    Person.add(new erm.StringAttribute('SURNAME', { ru: { name: 'Фамилия' } }, true, undefined, 20, undefined, true, undefined, {
        relation: 'GD_PEOPLE'
    }));
    /**
     * Сотрудник, частный случай физического лица.
     * Добавляется таблица GD_EMPLOYEE.
     */
    const Employee = erModel.add(new erm.Entity(Person, 'Employee', { ru: { name: 'Физическое лицо' } }, false, {
        relation: {
            relationName: 'GD_EMPLOYEE'
        }
    }));
    Employee.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Организация или подразделение' } }, [Company, Department]));
    /**
     * Группа контактов.
     * CONTACTLIST -- множество, которое хранится в кросс-таблице.
     */
    const Group = erModel.add(new erm.Entity(undefined, 'Group', { ru: { name: 'Группа' } }, false, {
        relation: {
            relationName: 'GD_CONTACT',
            structure: 'LBRB',
            selector: {
                field: 'CONTACTTYPE',
                value: 1
            }
        }
    }));
    Group.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Group.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в папку' } }, [Folder]));
    Group.add(new erm.StringAttribute('NAME', { ru: { name: 'Наименование' } }, true, undefined, 60, undefined, true, undefined));
    const ContactList = Group.add(new erm.SetAttribute('CONTACTLIST', { ru: { name: 'Контакты' } }, false, [Company, Person], {
        crossRelation: 'GD_CONTACTLIST'
    }));
    ContactList.add(new erm.IntegerAttribute('RESERVED', { ru: { name: 'Зарезервировано' } }, false, undefined, undefined, undefined));
    /**
     * Административно-территориальная единица.
     * Тут исключительно для иллюстрации типа данных Перечисление.
     */
    const Place = erModel.add(new erm.Entity(undefined, 'Place', { ru: { name: 'Папка' } }, false, {
        relation: {
            relationName: 'GD_PLACE',
            structure: 'LBRB'
        }
    }));
    Place.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Place.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в' } }, [Place]));
    Place.add(new erm.StringAttribute('NAME', { ru: { name: 'Наименование' } }, true, undefined, 60, undefined, true, undefined));
    Place.add(new erm.EnumAttribute('PLACETYPE', { ru: { name: 'Тип' } }, true, [
        {
            value: 'Область'
        },
        {
            value: 'Район'
        },
    ], 'Область'));
    Place.add(new erm.TimeStampAttribute('EDITIONDATE', { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'));
    /**
     * Документ.
     */
    const Document = erModel.add(new erm.Entity(undefined, 'Document', { ru: { name: 'Документ' } }, true, {
        relation: {
            relationName: 'GD_DOCUMENT',
            structure: 'TREE'
        }
    }));
    Document.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
    Document.add(new erm.ParentAttribute('PARENT', { ru: { name: 'Входит в' } }, [Document]));
    Document.add(new erm.TimeStampAttribute('EDITIONDATE', { ru: { name: 'Изменено' } }, true, new Date('2000-01-01'), new Date('2100-12-31'), 'CURRENT_TIMESTAMP(0)'));
    function createEntity(relation, entityName) {
        const found = Object.entries(erModel.entities).find(e => {
            const adapter = e[1].adapter;
            if (adapter) {
                if (Array.isArray(adapter.relation)) {
                    return !!adapter.relation.find((r) => r.relationName === relation.name && !r.weak);
                }
                else {
                    return adapter.relation.relationName === relation.name;
                }
            }
            else {
                return e[0] === relation.name;
            }
        });
        if (found) {
            return found[1];
        }
        const pkFields = relation.primaryKey.fields.join();
        const parent = Object.entries(relation.foreignKeys).reduce((p, fk) => {
            if (!p && fk[1].fields.join() === pkFields) {
                return createEntity(dbs.relationByUqConstraint(fk[1].constNameUq));
            }
            else {
                return p;
            }
        }, undefined);
        const rf = relation.relationFields;
        const structure = rf['PARENT'] ?
            (rf['LB'] && rf['RB'] ? 'LBRB' : 'TREE') : 'PLAIN';
        const adapter = {
            relation: {
                relationName: relation.name,
                structure
            }
        };
        const setEntityName = entityName ? entityName : relation.name;
        const entity = new erm.Entity(parent, setEntityName, atrelations[relation.name].lName, false, setEntityName !== relation.name || structure !== 'PLAIN' ? adapter : undefined);
        if (!parent) {
            entity.add(new erm.SequenceAttribute('ID', { ru: { name: 'Идентификатор' } }, GDGUnique));
        }
        ;
        return erModel.add(entity);
    }
    ;
    /**
     * Простейший случай таблицы. Никаких ссылок.
     * -- Если имя Entity совпадает с именем таблицы и ее структура PLAIN, то можем не указывать адаптер.
     * -- Первое добавляемое поле в Entity автоматом становится PK.
     * -- Если имя атрибута совпадает с именем поля, то в адаптере имя поля можно не указывать.
     */
    createEntity(dbs.relations.WG_HOLIDAY);
    /**
     * @todo Parse fields CHECK constraint and extract min and max allowed values.
     */
    function createAttributes(entity) {
        const relations = [];
        if (!entity.adapter) {
            relations.push(dbs.relations[entity.name]);
        }
        else {
            if (Array.isArray(entity.adapter.relation)) {
                entity.adapter.relation.forEach(ar => relations.push(dbs.relations[ar.relationName]));
            }
            else {
                relations.push(dbs.relations[entity.adapter.relation.relationName]);
            }
        }
        relations.forEach(r => {
            if (!r.primaryKey)
                return;
            Object.entries(r.relationFields).forEach(rf => {
                if (r.primaryKey.fields.find(f => f === rf[0]))
                    return;
                const attributeName = entity.hasAttribute(rf[0]) ? `${r.name}.${rf[0]}` : rf[0];
                const fieldSource = dbs.fields[rf[1].fieldSource];
                const lName = atrelations[r.name].relationFields[rf[1].name].lName;
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
                                    return new erm.EntityAttribute(attributeName, lName, required, [createEntity(dbs.relationByUqConstraint(fk[1].constNameUq))], adapter);
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
    dbs.forEachRelation(r => {
        if (r.primaryKey && r.primaryKey.fields.join() === 'ID' && /^USR\$.+$/.test(r.name)) {
            createEntity(r);
        }
    });
    Object.entries(erModel.entities).forEach(e => createAttributes(e[1]));
    return erModel;
}
exports.erExport = erExport;
//# sourceMappingURL=index.js.map