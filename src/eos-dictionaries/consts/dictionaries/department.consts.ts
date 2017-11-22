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
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'ISN_ORGANIZ',
        title: 'Не используется Организация',
        type: 'number'
    }, {
        key: 'LAYER',
        title: 'LAYER',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящей вершины',
        type: 'number'
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
        type: 'text',
        foreignKey: 'CLASSIF_NAME',
        length: 255,
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
        key: 'DUTY',
        title: 'Краткое наименование должности',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fullTitle',
        title: 'Полное наименование подразделения',
        type: 'text',
        foreignKey: 'FULLNAME',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'text',
        foreignKey: 'FULLNAME',
        length: 2000,
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
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'DEPARTMENT_DUE',
        title: 'Картотека ДЛ',
        type: 'text',
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
        type: 'number'
    }, {
        key: 'ORDER_NUM',
        title: 'Порядковый номер в кабинете',
        type: 'number'
    }, {
        key: 'indexPerson',
        title: 'Индекс ДЛ',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
        foreignKey: 'DEPARTMENT_INDEX',
    }, {
        key: 'indexDep',
        title: 'Индекс',
        type: 'text',
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
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
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
        type: 'number'
    }, {
        key: 'PHONE_LOCAL',
        title: '№ местного телефона',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'PHONE',
        title: '№ телефона',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'FAX',
        title: 'Факс',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'E_MAIL',
        title: 'E-mail',
        type: 'text',
        length: 64,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'NUM_CAB',
        title: '№ кабинета',
        type: 'text',
        length: 24,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'DUE_LINK_ORGANIZ',
        title: 'Due связанной организации',
        type: 'text',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'ISN_PHOTO',
        title: 'ISN фотографии',
        type: 'photo',
    }, {
        key: 'INS_DATE',
        title: 'Дата и время создания',
        type: 'date',
    },  {
        key: 'INS_WHO',
        title: 'Кто создал',
        type: 'number',
    }, {
        key: 'UPD_DATE',
        title: 'Дата и время обновления',
        type: 'date',
    },  {
        key: 'UPD_WHO',
        title: 'Кто обновил',
        type: 'number',
    },
    /*NO DISCRIPTION FIELDS*/
     {
        key: 'ISN_LCLASSIF',
        title: 'ISN_CLASSIF',
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
    searchFields: [/* 'RUBRIC_CODE', */'CLASSIF_NAME'/*, 'NOTE'*/],
    listFields: {
        person: ['CODE', 'fio'],
        department: ['CODE', 'title']
    },
    fullSearchFields: {
        person: ['CODE', 'PHONE', 'firstName', 'lastName', 'fathersName', 'E_MAIL'],
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
        department: ['CODE', 'title', 'indexDep', 'NOTE', 'fullTitle'],
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
        room: ['titleRoom', 'fullTitleRoom']
    },
    quickViewFields: {
        person: ['fullPosition', 'DUTY', 'PHONE', 'PHONE_LOCAL', 'E_MAIL', 'IS_NODE', 'POST_H'], // 'SURNAME', 'firstName', 'fathersName', 'lastName', 'photo' is in shortQuickViewFields
        department: ['CARD_NAME', 'CARD_FLAG', 'CODE', 'NOTE', 'IS_NODE', 'SEV'] // title is in shortQuickViewFields
        // ['fullPosition', 'department', 'phone', 'email', 'rooms', 'photo']
    },
    shortQuickViewFields: {
        person: ['SURNAME', 'firstName', 'fathersName', 'lastName', 'photo'],
        department: ['title']
    },
    editFields: { // TODO: remove IS_NODE!!!
        person: ['IS_NODE', 'CODE', 'fio', 'NOTE', 'SURNAME', 'indexPerson', 'POST_H', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'START_DATE', 'END_DATE',
            'gender', 'SEV', 'lastName', 'firstName', 'fathersName', 'DUTY', 'fullPosition', 'SKYPE', 'shortPositionRP', 'shortPositionDP', 'shortPositionVP',
            'fioDP', 'iofDP', 'lastNameRP', 'firstNameRP', 'fathersNameRP', 'lastNameDP', 'firstNameDP', 'fathersNameDP', 'lastNameVP', 'firstNameVP', 'fathersNameVP',
            'lastNameTP', 'firstNameTP', 'fathersNameTP', 'lastNamePP', 'firstNamePP', 'fathersNamePP'],
        department: ['IS_NODE', 'CODE', 'title', 'NOTE', 'START_DATE', 'END_DATE', 'CARD_NAME', 'CARD_FLAG', 'DUE_LINK_ORGANIZ', 'indexDep',
            'INDEX', 'SEV', 'fullTitle', 'titleRP', 'notInPositionTitle'],
        // ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers']
    },
    allVisibleFields: ['CODE', 'CLASSIF_NAME', 'NOTE', 'fullTitle', 'sev'],
};
/* tslint:enable:max-line-length */
