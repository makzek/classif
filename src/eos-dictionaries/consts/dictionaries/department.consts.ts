import { E_DICT_TYPE, IDepartmentDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';

/* tslint:disable:max-line-length */
export const DEPARTMENTS_DICT: IDepartmentDictionaryDescriptor = {
    id: 'departments',
    apiInstance: 'DEPARTMENT',
    dictType: E_DICT_TYPE.department,
    title: 'Подразделения (unstable)',
    visible: true,
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'import', 'export', 'importPhotos',
        'createRepresentative', 'tableCustomization', 'showAllSubnodes', 'edit', 'view', 'slantForForms', 'restore', 'remove', 'removeHard',
        'showDeleted'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    modeField: 'IS_NODE',
    searchConfig: [SEARCH_TYPES.full, SEARCH_TYPES.quick, SEARCH_TYPES.dateFilter],
    modeList: [{
        key: 'department',
        title: 'Подразделение',
    }, {
        key: 'cabinet',
        title: 'Кабинет',
    }, {
        key: 'person',
        title: 'Должностное лицо',
    }],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'ISN_ORGANIZ',
        title: 'Не используется Организация',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения.  Пробелы запрещены.'
    }, {
        key: 'LAYER',
        title: 'LAYER',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящей вершины',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения.  Пробелы запрещены.'
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'boolean'
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Parent ID',
        length: 248,
    }, {
        key: 'WEIGHT',
        title: 'WEIGHT',
        type: 'number'
    }, {
        key: 'MAXDUE',
        title: 'MAXDUE',
        type: 'string'
    }, {
        key: 'title',
        title: 'Краткое наименование подразделения',
        type: 'string',
        foreignKey: 'CLASSIF_NAME',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        required: true,
    }, {
        key: 'fio',
        title: 'Фамилия И.О. - должность',
        type: 'string',
        foreignKey: 'CLASSIF_NAME',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'SURNAME',
        title: 'Фамилия И.О.',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
        required: true,
        forNode: true,
    }, {
        key: 'DUTY',
        title: 'Краткое наименование должности',
        type: 'string',
        length: 236,
        pattern: NOT_EMPTY_STRING,
        required: true,
        forNode: true,
    }, {
        key: 'fullTitle',
        title: 'Полное наименование подразделения',
        type: 'string',
        foreignKey: 'FULLNAME',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'string',
        foreignKey: 'FULLNAME',
        length: 1998,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'CODE',
        title: 'Код',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'SKYPE',
        title: 'Skype',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'DEPARTMENT_DUE',
        title: 'Картотека ДЛ',
        type: 'string',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'PROTECTED',
        title: 'PROTECTED',
        type: 'number'
    }, {
        key: 'DELETED',
        title: 'DELETED',
        type: 'number'
    }, {
        key: 'ISN_CABINET',
        title: 'ISN кабинета',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения. Пробелы запрещены.'
    }, {
        key: 'ORDER_NUM',
        title: 'Порядковый номер в кабинете',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения. Пробелы запрещены.'
    }, {
        key: 'indexPerson',
        title: 'Индекс ДЛ',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'DEPARTMENT_INDEX',
    }, {
        key: 'indexDep',
        title: 'Индекс',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'DEPARTMENT_INDEX',
    }, {
        key: 'POST_H',
        title: 'Начальник',
        type: 'boolean',
    }, {
        key: 'CARD_FLAG',
        title: 'Картотека',
        type: 'boolean',
    }, {
        key: 'CARD_NAME',
        title: 'Наименование картотеки',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        height: 212,
    }, {
        key: 'START_DATE',
        title: 'Начало действия',
        type: 'date',
    }, {
        key: 'END_DATE',
        title: 'Окончание действия',
        type: 'date',
    }, {
        key: 'ISN_CONTACT',
        title: 'ISN контакта',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения. Пробелы запрещены.'
    }, {
        key: 'PHONE_LOCAL',
        title: '№ местного телефона',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'PHONE',
        title: '№ телефона',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'FAX',
        title: 'Факс',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'E_MAIL',
        title: 'E-mail',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NUM_CAB',
        title: '№ кабинета',
        type: 'string',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'DUE_LINK_ORGANIZ',
        title: 'Организация',
        type: 'string',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ISN_PHOTO',
        title: 'ISN фотографии',
        type: 'number',
    }, {
        key: 'INS_DATE',
        title: 'Дата и время создания',
        type: 'date',
    }, {
        key: 'INS_WHO',
        title: 'Кто создал',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения. Пробелы запрещены.'
    }, {
        key: 'UPD_DATE',
        title: 'Дата и время обновления',
        type: 'date',
    }, {
        key: 'UPD_WHO',
        title: 'Кто обновил',
        type: 'number',
        pattern: /^\d*$/,
        invalidMessage: 'Только числовые значения. Пробелы запрещены.'
    }, {
        key: 'printInfo',
        type: 'dictionary',
        title: '',
    }, {
        key: 'sev',
        type: 'dictionary',
        title: '',
    }, {
        key: 'organization',
        type: 'dictionary',
        title: '',
    }, {
        key: 'cabinet',
        type: 'dictionary',
        title: '',
    }, {
        key: 'user',
        type: 'dictionary',
        title: '',
    },
    /*NO DISCRIPTION FIELDS*/
    {
        key: 'ISN_LCLASSIF',
        title: 'ISN_CLASSIF',
        type: 'number'
    }, {
        key: 'INDEX',
        title: 'Индекс',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'alternate',
        title: 'Заместитель',
        type: 'string',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'type',
        title: 'Тип',
        type: 'icon'
    }, {
        key: 'titleRoom',
        title: 'Краткое наименование кабинета',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'CLASSIF_NAME',
    }, {
        key: 'fullTitleRoom',
        title: 'Полное наименование кабинета',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'fullTitleRoom',
    }, {
        key: 'photo',
        type: 'dictionary',
        title: 'Фото'
    }],
    treeFields: ['title'],
    searchFields: [/* 'RUBRIC_CODE', */'title'/*, 'NOTE'*/],
    listFields: ['CODE', 'title'],
    fullSearchFields: {
        person: ['CODE', 'PHONE', 'PHONE_LOCAL', 'E_MAIL', 'DUTY', 'fullPosition'],
        department: ['CODE', 'title', 'indexDep', 'NOTE', 'fullTitle', ],
        cabinet: ['titleRoom'/*, 'fullTitleRoom'*/]
    },
    quickViewFields: ['photo', 'fullTitle', 'fullPosition', 'DUTY', 'PHONE', 'PHONE_LOCAL', 'E_MAIL', 'IS_NODE', 'POST_H', 'SURNAME',
        'CARD_NAME', 'CARD_FLAG', 'CODE', 'NOTE', 'IS_NODE', 'printInfo', 'user', 'cabinet', 'sev', 'title'], // title is in shortQuickViewFields
    shortQuickViewFields: ['firstName', 'fathersName', 'lastName', 'title'],
    editFields: ['IS_NODE', 'CODE', 'fio', 'NOTE', 'SURNAME', 'indexPerson', 'POST_H', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'START_DATE', 'END_DATE',
        'DUTY', 'fullPosition', 'SKYPE', 'printInfo', 'sev', 'organization', 'cabinet', 'user', 'CLASSIF_NAME',
        'IS_NODE', 'CODE', 'title', 'NOTE', 'START_DATE', 'END_DATE', 'CARD_NAME', 'CARD_FLAG', 'DUE_LINK_ORGANIZ', 'indexDep',
        'INDEX', 'fullTitle', 'printInfo', 'sev', 'organization', 'cabinet', 'user', 'ISN_PHOTO', 'photo'],
    // ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers']
    allVisibleFields: ['SURNAME', 'DUTY', 'fullTitle', 'SKYPE', 'DEPARTMENT_DUE', 'ORDER_NUM', 'indexDep', 'POST_H', 'CARD_FLAG',
        'CARD_NAME', 'NOTE', 'START_DATE', 'END_DATE', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'DUE_LINK_ORGANIZ'/*, 'printInfo', 'sev',
'organization', 'cabinet', 'user'*/],
};
/* tslint:enable:max-line-length */
