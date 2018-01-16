import { ITreeDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';


export const ORGANIZ_DICT: ITreeDictionaryDescriptor = {
    id: 'organiz',
    apiInstance: 'ORGANIZ_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Организации',
    visible: true,
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick /*, SEARCH_TYPES.full*/],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'Код Дьюи организации',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Код родительской организации',
        length: 248,
    }, {
        key: 'ISN_NODE',
        type: 'number',
        title: 'ISN организации',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящ вершины',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'LAYER',
        title: 'Номер уровня',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 4,
        invalidMessage: 'Максимальная длина 4 символа. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'IS_NODE',
        title: 'Признак вершины',
        type: 'number',
        length: 1,
    }, {
        key: 'WEIGHT',
        title: 'Вес элемента',
        type: 'number',
        length: 10,
    }, {
        key: 'MAXDUE',
        title: 'MAX значение кода Дьюи',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 248,
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование организации',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 255,
        required: true,
    }, {
        key: 'CLASSIF_NAME_SEARCH',
        title: 'Поиск наименование организации',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'PROTECTED',
        title: 'Признак запрета удаления',
        type: 'number',
        length: 1,
    }, {
        key: 'DELETED',
        title: 'Признак лог удаления',
        type: 'number',
        length: 1,
    }, {
        key: 'FULLNAME',
        title: 'Полное наименование',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ZIPCODE',
        title: 'Почтовый индекс',
        type: 'string',
        length: 12,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'CITY',
        title: 'Город',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ADDRESS',
        title: 'Почтовый адрес',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'MAIL_FOR_ALL',
        title: 'Признак использования e-mail для всех представителей',
        type: 'number',
        length: 1,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NEW_RECORD',
        title: 'Признак новой записи',
        type: 'number',
        length: 1,
    }, {
        key: 'OKPO',
        title: 'ОКПО',
        type: 'string',
        length: 16,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'INN',
        title: 'ИНН',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ISN_REGION',
        title: 'Регион',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'OKONH',
        title: 'ОКОНХ',
        type: 'string',
        length: 16,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'LAW_ADRESS',
        title: 'Юридический адрес',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ISN_ORGANIZ_TYPE',
        title: 'Форма Собственности',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'SERTIFICAT',
        title: 'Регистрационное свидетельство',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ISN_ADDR_CATEGORY',
        title: 'Категория адресата',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'CODE',
        title: 'поле для формирования выписок для ЦБ',
        type: 'string',
        length: 4,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 4 символа. Можно вводить только числовые значения.'
    }, {
        key: 'OGRN',
        title: 'ОГРН',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'INS_DATE',
        title: 'Дата и время создания',
        type: 'date',
    }, {
        key: 'INS_WHO',
        title: 'Кто создал',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'UPD_DATE',
        title: 'Дата и время обновления',
        type: 'date',
    }, {
        key: 'UPD_WHO',
        title: 'Кто обновил',
        type: 'number',
        pattern: NOT_EMPTY_STRING,
        length: 10,
        invalidMessage: 'Максимальная длина 10 символов. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'contact',
        type: 'dictionary',
        title: '',

    }, {
        key: 'bank-recvisit',
        type: 'dictionary',
        title: '',

    }, {
        key: 'ar-organiz-value',
        type: 'dictionary',
        title: '',

        }],
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'CLASSIF_NAME_SEARCH', 'FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS', 'MAIL_FOR_ALL', 'NOTE', 'OKPO',
        'INN', 'ISN_REGION', 'OKONH', 'LAW_ADRESS', 'ISN_ORGANIZ_TYPE', 'SERTIFICAT', 'ISN_ADDR_CATEGORY', 'CODE', 'OGRN',
        'contact', 'bank-recvisit', 'ar-organiz-value'],
    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: [],
    quickViewFields: ['FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS', 'OKPO', 'INN', 'OKONH', 'LAW_ADRESS', 'ISN_ORGANIZ_TYPE', 'SERTIFICAT',
        'ISN_ADDR_CATEGORY', 'CODE', 'OGRN'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CLASSIF_NAME_SEARCH', 'FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS', 'MAIL_FOR_ALL', 'NOTE', 'OKPO',
        'INN', 'ISN_REGION', 'OKONH', 'LAW_ADRESS', 'ISN_ORGANIZ_TYPE', 'SERTIFICAT', 'ISN_ADDR_CATEGORY', 'CODE', 'OGRN'],
};
