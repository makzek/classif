import { ITreeDictionaryDescriptor, E_DICT_TYPE } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';


export const ORGANIZ_DICT: ITreeDictionaryDescriptor = {
    id: 'organiz',
    apiInstance: 'ORGANIZ_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Организации',
    actions: ['add'],
    itemActions: ['edit'],
    groupActions: ['remove', 'removeHard'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'Код Дьюи организации',
        length: 248,
    }, {
        key: 'ISN_NODE',
        type: 'number',
        title: 'ISN организации',
        length: 10,
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящ вершины',
        type: 'number',
        length: 10,
    }, {
        key: 'LAYER',
        title: 'Номер уровня',
        type: 'number',
        length: 4,
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
        length: 248,
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование организации',
        type: 'string',
        length: 255,
    }, {
        key: 'CLASSIF_NAME_SEARCH',
        title: 'Поиск наим ие организации',
        type: 'string',
        length: 255,
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
    }, {
        key: 'ZIPCODE',
        title: 'Почтовый индекс',
        type: 'string',
        length: 12,
    }, {
        key: 'CITY',
        title: 'Город',
        type: 'string',
        length: 255,
    }, {
        key: 'ADDRESS',
        title: 'Почтовый адрес',
        type: 'string',
        length: 255,
    }, {
        key: 'MAIL_FOR_ALL',
        title: 'Признак использования E_MAIL для всех представителей',
        type: 'number',
        length: 1,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
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
    }, {
        key: 'INN',
        title: 'ИНН',
        type: 'string',
        length: 64,
    }, {
        key: 'ISN_REGION',
        title: 'Регион',
        type: 'number',
        length: 10,
    }, {
        key: 'OKONH',
        title: 'ОКОНХ',
        type: 'string',
        length: 16,
    }, {
        key: 'LAW_ADRESS',
        title: 'Юридический Адресс',
        type: 'string',
        length: 255,
    }, {
        key: 'ISN_ORGANIZ_TYPE',
        title: 'Форма Собственности',
        type: 'number',
        length: 10,
    }, {
        key: 'SERTIFICAT',
        title: 'Регисрационное свидейтельство',
        type: 'string',
        length: 255,
    }, {
        key: 'ISN_ADDR_CATEGORY',
        title: 'Категория адресата',
        type: 'number',
        length: 10,
    }, {
        key: 'CODE',
        title: 'поле для формирования выписок для ЦБ',
        type: 'string',
        length: 4,
    }, {
        key: 'OGRN',
        title: 'ОГРН',
        type: 'string',
        length: 64,
    }, {
        key: 'INS_DATE',
        title: 'Дата и время создания',
        type: 'date',
    }, {
        key: 'INS_WHO',
        title: 'Кто создал',
        type: 'number',
        length: 10,
    }, {
        key: 'UPD_DATE',
        title: 'Дата и время обновления',
        type: 'date',
    }, {
        key: 'UPD_WHO',
        title: 'Кто обновил',
        type: 'number',
        length: 10,
    }],
    editFields: [],
    searchFields: [],
    fullSearchFields: [],
    quickViewFields: [],
    shortQuickViewFields: [],
    listFields: [],
    allVisibleFields: [],
};
