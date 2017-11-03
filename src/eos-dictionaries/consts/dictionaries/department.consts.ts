import { E_DICT_TYPE, IDepartmentDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';

/* tslint:disable:max-line-length */
export const DEPARTMENTS_DICT: IDepartmentDictionaryDescriptor = {
    id: 'departments',
    apiInstance: 'DEPARTMENT',
    dictType: E_DICT_TYPE.department,
    title: 'Подразделения (unstable)',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'import', 'export', 'importPhotos',
        'createRepresentative'],
    itemActions: ['edit', 'view', 'slantForForms'],
    groupActions: ['remove', 'removeHard'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    modeField: 'IS_NODE',
    searchConfig: [SEARCH_TYPES.full, SEARCH_TYPES.quick, SEARCH_TYPES.dateFilter],
    modeList: [{
        key: 'department',
        title: 'Подразделение',
    }, {
        key: 'room',
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
        key: 'RUBRIC_CODE',
        title: 'Код',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 64,
    }, {
        key: 'title',
        title: 'Краткое наименование подразделения',
        type: 'text',
        foreignKey: 'CLASSIF_NAME',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fullTitle',
        title: 'Полное наименование подразделения',
        type: 'text',
        foreignKey: 'fullTitle',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'CODE',
        title: 'Code',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'DELETED',
        title: 'DELETED',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'ISN_HIGH_NODE',
        type: 'number'
    }, {
        key: 'ISN_LCLASSIF',
        title: 'ISN_CLASSIF',
        type: 'number'
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'boolean'
    }, {
        key: 'PARENT_DUE',
        title: 'PARENT_DUE',
        type: 'string'
    }, {
        key: 'PROTECTED',
        title: 'PROTECTED',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'WEIGHT',
        type: 'number'
    }, {
        key: 'titleRP',
        title: 'Наименование в родительном падеже (чего?)',
        type: 'text',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'notInPositionTitle',
        title: 'Не использовать подразделение в названии должности',
        type: 'boolean',
    }, {
        key: 'SEV',
        title: 'Индекс СЭВ',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'INDEX',
        title: 'Индекс',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'file',
        key: 'CARD_FLAG',
        title: 'Картотека',
        type: 'boolean',
    }, {
        // key: 'fileName',
        key: 'CARD_NAME',
        title: 'Наименование картотеки',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'organization',
        key: 'DUE_LINK_ORGANIZ',
        title: 'Организация',
        type: 'text',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'startDate',
        key: 'START_DATE',
        title: 'Начало действия',
        type: 'date',
    }, {
        // key: 'endDate',
        key: 'END_DATE',
        title: 'Окончание действия',
        type: 'date',
    }, {
        // key: 'shortPosition',
        key: 'DUTY',
        title: 'Краткое наименование должности',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'text',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fio',
        title: 'Фамилия И.О. - должность',
        type: 'text',
        foreignKey: 'CLASSIF_NAME',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'SURNAME',
        title: 'Фамилия И.О.',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'gender',
        title: 'Пол',
        type: 'text',
    }, {
        // key: 'lastName',
        key: 'lastName',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
        length: 60,
    }, {
        key: 'firstName',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
        length: 60,
    }, {
        key: 'fathersName',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
        length: 60,
    }, {
        // key: 'indexOfficial',
        key: 'indexPerson',
        title: 'Индекс ДЛ',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'DEPARTMENT_INDEX',
    }, {
        // key: 'indexOfficial',
        key: 'indexDep',
        title: 'Индекс',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'DEPARTMENT_INDEX',
    }, {
        key: 'DEPARTMENT_DUE',
        title: 'Картотека ДЛ',
        type: 'text',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'boss',
        key: 'POST_H',
        title: 'Начальник',
        type: 'boolean',
    }, {
        // key: 'localPhone',
        key: 'PHONE_LOCAL',
        title: '№ местного телефона',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'phone',
        key: 'PHONE',
        title: '№ телефона',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'room',
        key: 'NUM_CAB',
        title: '№ кабинета',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'fax',
        key: 'FAX',
        title: 'Факс',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        // key: 'email',
        key: 'E_MAIL',
        title: 'E-mail',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'skype',
        title: 'Skype',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'photo',
        title: 'Фотография',
        type: 'photo',
    }, {
        key: 'alternate',
        title: 'Заместитель',
        type: 'text',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'extraData',
        title: 'Дополнительные сведения',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'type',
        title: 'Тип',
        type: 'icon'
    }, {
        key: 'department',
        title: 'Подразделение',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'shortPositionRP',
        title: 'Родительный падеж (кого, чего)',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'shortPositionDP',
        title: 'Дательный падеж (кому, чему?)',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'shortPositionVP',
        title: 'Винительный падеж (кого, что?)',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fioDP',
        title: 'Фамилия И.О. в дательном падеже',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'iofDP',
        title: 'И.О. Фамилия в дательном падеже',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'lastNameRP',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'firstNameRP',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fathersNameRP',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'lastNameDP',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'firstNameDP',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fathersNameDP',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'lastNameVP',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'firstNameVP',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fathersNameVP',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'lastNameTP',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'firstNameTP',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fathersNameTP',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'lastNamePP',
        title: 'Фамилия',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'firstNamePP',
        title: 'Имя',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fathersNamePP',
        title: 'Отчество',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'titleRoom',
        title: 'Краткое наименование кабинета',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'CLASSIF_NAME',
    }, {
        key: 'fullTitleRoom',
        title: 'Краткое наименование кабинета',
        type: 'text',
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'fullTitleRoom',
    }],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    listFields: {
        person: ['RUBRIC_CODE', 'fio'],
        department: ['RUBRIC_CODE', 'title']
    },
    fullSearchFields: {
        person: ['RUBRIC_CODE', 'PHONE', 'firstName', 'lastName', 'fathersName', 'E_MAIL'],
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
        department: ['RUBRIC_CODE', 'title', 'indexDep', 'NOTE', 'fullTitle'],
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
        room: ['titleRoom', 'fullTitleRoom']
    },
    quickViewFields: {
        person: ['lastName', 'firstName', 'fathersName', 'fullPosition', 'DUTY', 'photo', 'PHONE', 'PHONE_LOCAL', 'E_MAIL'], // SURNAME is in shortQuickViewFields
        department: ['CARD_NAME', 'CARD_FLAG', 'RUBRIC_CODE', 'NOTE'] // title is in shortQuickViewFields
        // ['fullPosition', 'department', 'phone', 'email', 'rooms', 'photo']
    },
    shortQuickViewFields: {
        person: ['SURNAME'],
        department: ['title']
    },
    editFields: { // TODO: remove IS_NODE!!!
        person: ['IS_NODE', 'RUBRIC_CODE', 'fio', 'NOTE', 'SURNAME', 'indexPerson', 'POST_H', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'START_DATE', 'END_DATE',
            'gender', 'SEV', 'lastName', 'firstName', 'fathersName', 'DUTY', 'fullPosition', 'skype', 'shortPositionRP', 'shortPositionDP', 'shortPositionVP',
            'fioDP', 'iofDP', 'lastNameRP', 'firstNameRP', 'fathersNameRP', 'lastNameDP', 'firstNameDP', 'fathersNameDP', 'lastNameVP', 'firstNameVP', 'fathersNameVP',
            'lastNameTP', 'firstNameTP', 'fathersNameTP', 'lastNamePP', 'firstNamePP', 'fathersNamePP'],
        department: ['IS_NODE', 'RUBRIC_CODE', 'title', 'NOTE', 'START_DATE', 'END_DATE', 'CARD_NAME', 'CARD_FLAG', 'DUE_LINK_ORGANIZ', 'indexDep',
            'INDEX', 'SEV', 'fullTitle', 'titleRP', 'notInPositionTitle'],
        // ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers']
    },
    allVisibleFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'fullTitle', 'sev'],
};
/* tslint:enable:max-line-length */
