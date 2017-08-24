import { IDictionaryDescriptor } from './dictionary-descriptor';
export const SEARCH_KEYS = ['code', 'title', 'description'];

export const BASIC_DICT: IDictionaryDescriptor = {
    id: 'rubricator',
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'quickSearch', 'fullSearch', 'sorting'],
    itemActions: ['edit', 'view'],
    groupActions: ['remove', 'removeHard'],
    keyField: 'id',
    fields: [{
        key: 'id',
        type: 'string',
        title: 'ID'
    }, {
        key: 'code',
        title: 'Код',
        type: 'string'
    }, {
        key: 'title',
        title: 'Заголовок',
        type: 'text'
    }, {
        key: 'description',
        title: 'Описание',
        type: 'text'
    }],
    editFields: ['code', 'title', 'description'],
    searchFields: ['code', 'title', 'description'],
    fullSearchFields: ['code', 'title', 'description'],
    quickViewFields: ['code', 'title', 'description'],
    shortQuickViewFields: ['title'],
    listFields: ['code', 'title']
};

export const DEPARTMENTS_DICT: IDictionaryDescriptor = {
    id: 'departments',
    title: 'Подразделения',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'quickSearch', 'fullSearch',
        'sorting', 'import', 'export', 'importPhotos', 'createRepresentative'],
    itemActions: ['edit', 'view', 'slantForForms'],
    groupActions: ['remove', 'removeHard'],

    keyField: 'id',
    fields: [{
        key: 'id',
        type: 'string',
        title: 'ID'
    }, {
        key: 'code',
        title: 'Код',
        type: 'string',
        column: 2,
    }, {
        key: 'title',
        title: 'Заголовок',
        type: 'text',
    }, {
        key: 'description',
        title: 'Описание',
        type: 'text'
    }, {
        key: 'titleRP',
        title: 'Заголовок в родительном падеже',
        type: 'text',
    }, {
        key: 'notInPositionTitle',
        title: 'Не использовать подразделение в названии должности',
        type: 'boolean',
    }, {
        key: 'SEV',
        title: 'Индекс СЭВ',
        type: 'text',
        column: 2,
    }, {
        key: 'index',
        title: 'Индекс',
        type: 'text',
    }, {
        key: 'file',
        title: 'Картотека',
        type: 'boolean',
    }, {
        key: 'fileName',
        title: 'Наименование картотеки',
        type: 'text'
    }, {
        key: 'organization',
        title: 'Организация',
        type: 'text',
    }, {
        key: 'note',
        title: 'Примечание',
        type: 'text',
        column: 1,
    }, {
        key: 'startDate',
        title: 'Дата начала действия',
        type: 'date',
        column: 1,
        subcolumn: 1,
    }, {
        key: 'endDate',
        title: 'Дата окончания действия',
        type: 'date',
        column: 1,
        subcolumn: 2,
    }, {
        key: 'shortPosition',
        title: 'Наименование должности',
        type: 'text',
        column: 1,
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'text',
        column: 1,
    }, {
        key: 'fio',
        title: 'Фамилия И.О.',
        type: 'text',
        column: 1,
    }, {
        key: 'gender',
        title: 'Пол',
        type: 'text',
        column: 1,
    }, {
        key: 'lastName',
        title: 'Фамилия',
        type: 'text',
        column: 1,
        subcolumn: 1,
    }, {
        key: 'firstName',
        title: 'Имя',
        type: 'text',
        column: 1,
        subcolumn: 2,
    }, {
        key: 'fathersName',
        title: 'Отчество',
        type: 'text',
        column: 1,
        subcolumn: 3,
    }, {
        key: 'indexOfficial',
        title: 'Индекс должностного лица',
        type: 'text',
        column: 2,
    }, {
        key: 'boss',
        title: 'Начальник',
        type: 'boolean',
        column: 2,
    }, {
        key: 'localPhone',
        title: '№ местного телефона',
        type: 'text'
    }, {
        key: 'phone',
        title: '№ телефона',
        type: 'text'
    }, {
        key: 'room',
        title: '№ кабинета',
        type: 'text'
    }, {
        key: 'fax',
        title: 'Факс',
        type: 'text'
    }, {
        key: 'email',
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
        column: 2,
    }, {
        key: 'alternate',
        title: 'Заместитель',
        type: 'text',
        column: 1,
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

    fullSearchFields: ['isPerson', 'code', 'title', 'description', 'fio', 'lastName', 'firstName', 'fathersName', 'phone', 'localPhone',
        'email', 'note'],
    editFields: ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers'],
    quickViewFields: ['fullPosition', 'department', 'phone', 'email', 'rooms', 'photo'],
    listFields: ['type', 'shortPosition'],
    shortQuickViewFields: ['lastName', 'firstName', 'fathersName'],
    searchFields: [],
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
};
