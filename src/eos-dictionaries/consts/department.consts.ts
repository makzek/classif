import { IDepartmentDictionaryDescriptor } from '../core/department-dictionary-descriptor';
/* tslint:disable:max-line-length */
export const DEPARTMENTS_DICT: IDepartmentDictionaryDescriptor = {
    id: 'departments',
    apiInstance: 'DEPARTMENT',
    title: 'Подразделения',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'import', 'export', 'importPhotos',
        'createRepresentative'],
    itemActions: ['edit', 'view', 'slantForForms'],
    groupActions: ['remove', 'removeHard'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    modeField: 'IS_NODE',
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'ID'
    }, {
        key: 'RUBRIC_CODE',
        title: 'Код',
        type: 'string'
    }, {
        key: 'CLASSIF_NAME',
        title: 'Заголовок',
        type: 'text'
    }, {
        key: 'NOTE',
        title: 'Описание',
        type: 'text'
    }, {
        key: 'CODE',
        title: 'Code',
        type: 'string'
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
    }, /*{
        key: 'id',
        type: 'string',
        title: 'ID'
    }, {
        key: 'code',
        title: 'Код',
        type: 'string',
    }, {
        key: 'title',
        title: 'Заголовок',
        type: 'text',
    }, {
        key: 'description',
        title: 'Описание',
        type: 'text'
    }, */{
        key: 'titleRP',
        title: 'Подразделение в родительном падеже',
        type: 'text',
    }, {
        key: 'notInPositionTitle',
        title: 'Не использовать подразделение в названии должности',
        type: 'boolean',
    }, {
        key: 'SEV',
        title: 'Индекс СЭВ',
        type: 'text',
    }, {
        key: 'index',
        title: 'Индекс',
        type: 'text',
    }, {
        // key: 'file',
        key: 'CARD_FLAG',
        title: 'Картотека',
        type: 'boolean',
    }, {
        // key: 'fileName',
        key: 'CARD_NAME',
        title: 'Наименование картотеки',
        type: 'text'
    }, {
        // key: 'organization',
        key: 'DUE_LINK_ORGANIZ',
        title: 'Организация',
        type: 'text',
    }, /* {
        // key: 'note',
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
    },*/ {
        // key: 'startDate',
        key: 'START_DATE',
        title: 'Дата начала действия',
        type: 'date',
    }, {
        // key: 'endDate',
        key: 'END_DATE',
        title: 'Дата окончания действия',
        type: 'date',
    }, {
        // key: 'shortPosition',
        key: 'DUTY',
        title: 'Наименование должности',
        type: 'text',
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'text',
    }, {
        // key: 'fio',
        key: 'CLASSIF_NAME', // not sure
        title: 'Фамилия И.О.',
        type: 'text',
    }, {
        key: 'gender',
        title: 'Пол',
        type: 'text',
    }, {
        // key: 'lastName',
        key: 'SURNAME',
        title: 'Фамилия',
        type: 'text',
    }, {
        key: 'firstName',
        title: 'Имя',
        type: 'text',
    }, {
        key: 'fathersName',
        title: 'Отчество',
        type: 'text',
    }, {
        // key: 'indexOfficial',
        key: 'DEPARTMENT_INDEX',
        title: 'Индекс ДЛ',
        type: 'text',
    }, {
        // key: 'boss',
        key: 'POST_H',
        title: 'Начальник',
        type: 'boolean',
    }, {
        // key: 'localPhone',
        key: 'PHONE_LOCAL',
        title: '№ местного телефона',
        type: 'text'
    }, {
        // key: 'phone',
        key: 'PHONE',
        title: '№ телефона',
        type: 'text'
    }, {
        // key: 'room',
        key: 'NUM_CAB',
        title: '№ кабинета',
        type: 'text'
    }, {
        // key: 'fax',
        key: 'FAX',
        title: 'Факс',
        type: 'text'
    }, {
        // key: 'email',
        key: 'E_MAIL',
        title: 'E-mail',
        type: 'text'
    }, {
        key: 'skype',
        title: 'Skype',
        type: 'text'
    }, {
        key: 'photo',
        title: 'Фотография',
        type: 'photo',
    }, {
        key: 'alternate',
        title: 'Заместитель',
        type: 'text',
    }, {
        key: 'extraData',
        title: 'Дополнительные сведения',
        type: 'text'
    }, {
        key: 'type',
        title: 'Тип',
        type: 'icon'
    }, {
        key: 'department',
        title: 'Подразделение',
        type: 'text'
    }, {
        key: 'shortPositionRP',
        title: 'Наименование должности в родительном падеже',
        type: 'text'
    }, {
        key: 'shortPositionDP',
        title: 'Наименование должности в дательном падеже',
        type: 'text'
    }, {
        key: 'shortPositionVP',
        title: 'Наименование должности в винительном падеже',
        type: 'text'
    }, {
        key: 'fioDP',
        title: 'Фамилия И.О., дательный падеж',
        type: 'text'
    }, {
        key: 'iof',
        title: 'И.О. Фамилия',
        type: 'text'
    }, {
        key: 'lastNameRP',
        title: 'Фамилия, родительный падеж',
        type: 'text',
    }, {
        key: 'firstNameRP',
        title: 'Имя, родительный падеж',
        type: 'text'
    }, {
        key: 'fathresNameRP',
        title: 'Отчество, родительный падеж',
        type: 'text'
    }, {
        key: 'lastNameDP',
        title: 'Фамилия, дательный падеж',
        type: 'text'
    }, {
        key: 'firstNameDP',
        title: 'Имя, дательный падеж',
        type: 'text'
    }, {
        key: 'fathresNameDP',
        title: 'Отчество, дательный падеж',
        type: 'text'
    }, {
        key: 'lastNameVP',
        title: 'Фамилия, винительный падеж',
        type: 'text'
    }, {
        key: 'firstNameVP',
        title: 'Имя, винительный падеж',
        type: 'text'
    }, {
        key: 'fathresNameVP',
        title: 'Отчество, винительный падеж',
        type: 'text'
    }, {
        key: 'lastNameTP',
        title: 'Фамилия, творительный падеж',
        type: 'text'
    }, {
        key: 'firstNameTP',
        title: 'Имя, творительный падеж',
        type: 'text'
    }, {
        key: 'fathresNameTP',
        title: 'Отчество, творительный падеж',
        type: 'text'
    }, {
        key: 'lastNamePP',
        title: 'Фамилия, предложный падеж',
        type: 'text'
    }, {
        key: 'firstNamePP',
        title: 'Имя, предложный падеж',
        type: 'text'
    }, {
        key: 'fathresNamePP',
        title: 'Отчество, предложный падеж',
        type: 'text'
    }],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    listFields: {
        person: ['RUBRIC_CODE', 'CLASSIF_NAME'],
        department: ['RUBRIC_CODE', 'CLASSIF_NAME']
    },
    fullSearchFields: {
        person: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
        department: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE']
        // ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone', 'email', 'note'],
    },
    quickViewFields: {
        person: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
        department: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE']
        // ['fullPosition', 'department', 'phone', 'email', 'rooms', 'photo']
    },
    shortQuickViewFields: {
        person: ['CLASSIF_NAME'],
        department: ['CLASSIF_NAME']
    },
    editFields: { // TODO: remove IS_NODE!!!
        person: ['IS_NODE', 'RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'SURNAME', 'DEPARTMENT_INDEX', 'POST_H', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'START_DATE', 'END_DATE', ],
        department: ['IS_NODE', 'RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'START_DATE', 'END_DATE', 'CARD_NAME', 'CARD_FLAG', 'DUE_LINK_ORGANIZ' ]
        // ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers']
    },
    /*
    fieldGroups: [{
        title: 'Основаная информация',
        fields: ['lastName', 'firstName', 'fathersName', 'fio', 'shortPosition', 'fullPosition', 'gender', 'alternate', 'note',
            'startDate', 'endDate', 'photo', 'boss', 'code', 'indexOfficial', 'SEV'],
    }, {
        title: 'Контактные данные',
        fields: ['phone', 'localPhone', 'email', 'skype', 'fax', 'room'],
    }, {
        title: 'Дополнительная информация',
        fields: ['shortPositionRP', 'shortPositionDP', 'shortPositionVP', 'fioDP', 'iof', 'lastNameRP', 'firstNameRP', 'fathresNameRP',
            'lastNameDP', 'firstNameDP', 'fathresNameDP', 'lastNameVP', 'firstNameVP', 'fathresNameVP', 'lastNameTP', 'firstNameTP',
            'fathresNameTP', 'lastNamePP', 'firstNamePP', 'fathresNamePP', 'shortPosition', 'department'],
    }],
    */
};
/* tslint:enable:max-line-length */
