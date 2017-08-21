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
        type: 'string'
    }, {
        key: 'title',
        title: 'Заголовок',
        type: 'text'
    }, {
        key: 'description',
        title: 'Описание',
        type: 'text'
    }, {
        key: 'titleRP',
        title: 'Заголовок в родительном падеже',
        type: 'text'
    }, {
        key: 'notInPositionTitle',
        title: 'Не использовать подразделение в названии должности',
        type: 'boolean'
    }, {
        key: 'SEV',
        title: 'Индекс СЭВ',
        type: 'text'
    }, {
        key: 'index',
        title: 'Индекс',
        type: 'text'
    }, {
        key: 'file',
        title: 'Картотека',
        type: 'boolean'
    }, {
        key: 'fileName',
        title: 'Наименование картотеки',
        type: 'text'
    }, {
        key: 'organization',
        title: 'Организация',
        type: 'text'
    }, {
        key: 'note',
        title: 'Примечание',
        type: 'text'
    }, {
        key: 'startDate',
        title: 'Дата начала действия',
        type: 'date'
    }, {
        key: 'endDate',
        title: 'Дата окончания действия',
        type: 'date'
    }, {
        key: 'isLeaf',
        title: 'Является листом',
        type: 'boolean'
    }, {
        key: 'shortPosition',
        title: 'Краткое наименование должности',
        type: 'text'
    }, {
        key: 'fullPosition',
        title: 'Полное наименование должности',
        type: 'text'
    }, {
        key: 'fio',
        title: 'ФИО',
        type: 'text'
    }, {
        key: 'sex',
        title: 'Пол',
        type: '["unknown", "male", "female"]'
    }, {
        key: 'lastName',
        title: 'Фамилия',
        type: 'text'
    }, {
        key: 'firstName',
        title: 'Имя',
        type: 'text'
    }, {
        key: 'fathersName',
        title: 'Отчество',
        type: 'text'
    }, {
        key: 'indexOfficial',
        title: 'Индекс должностного лица',
        type: 'text'
    }, {
        key: 'boss',
        title: 'Начальник',
        type: 'boolean'
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
        type: 'photo'
    }, {
        key: 'alternate',
        title: 'Заместитель',
        type: 'text'
    }, {
        key: 'extraData',
        title: 'Дополнительные сведения',
        type: 'text'
    }],

    fullSearchFields: ['type', 'code', 'title', 'description', 'fio', 'phone', 'email', 'note'],
    editFields: ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers'],
    quickViewFields: ['file-name', 'fio', 'organization', 'SEV'],
    listFields: [],
    shortQuickViewFields: [],
    searchFields: []
};
