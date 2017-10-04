import { IDictionaryDescriptor } from '../core/dictionary-descriptor';

/* tslint:disable:max-line-length */

export const ROOMS_DICT: IDictionaryDescriptor = {
    id: 'rooms',
    nodeId: '', // получить id корня
    apiInstance: 'ROOMS',
    title: 'Кабинеты',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder'],
    itemActions: ['edit', 'view'],
    groupActions: ['remove', 'removeHard', 'userOrder'],
    keyField: 'id',
    parentField: 'parent',
    fields: [{
        key: 'id',
        type: 'string',
        title: 'ID'
    }, {
        key: 'title',
        title: 'Краткое наименование кабинета',
        type: 'text'
    }, {
        key: 'description',
        title: 'Полное наименование кабинета',
        type: 'text'
    }, {
        key: 'department',
        title: 'Подразделение',
        type: 'text'
    }, {
        key: 'owner',
        title: 'Владелец кабинета',
        type: 'text' // ??? множественное поле, выбор значений из справочника Подразделения
    }, {
        key: 'accessToFoldersInput',
        title: 'Поступившие',
        type: 'boolean'
    }, {
        key: 'accessToFoldersInProgress',
        title: 'На исполнении',
        type: 'boolean'
    }, {
        key: 'accessToFoldersAtControl',
        title: 'На контроле',
        type: 'boolean'
    }, {
        key: 'accessToFoldersLeadership',
        title: 'У руководства',
        type: 'boolean'
    }, {
        key: 'accessToFoldersUnderConsideration',
        title: 'На рассмотрении',
        type: 'boolean'
    }, {
        key: 'accessToFoldersInCase',
        title: 'В дело',
        type: 'boolean'
    }, {
        key: 'accessToFoldersProjectManagement',
        title: 'Управление проектам',
        type: 'boolean'
    }, {
        key: 'accessToFoldersOnSight',
        title: 'На визировании',
        type: 'boolean'
    }, {
        key: 'accessToFoldersSignature',
        title: 'На подписи',
        type: 'boolean'
    }, {
        key: 'roomUsers',
        title: 'Пользователи кабинета',
        type: 'text' // ?? format
    }, {
        key: 'AccessRestrictionRK',
        title: 'Ограничение доступа к РК',
        type: 'boolean'
    }, {
        key: 'AccessRestrictionRKPD',
        title: 'Ограничение доступа к РКПД',
        type: 'boolean'
    }],
    editFields: [],
    searchFields: [],
    fullSearchFields: ['code', 'title', 'description'],
    quickViewFields: ['department', 'owner', 'roomUsers'],
    shortQuickViewFields: ['description'],
    listFields: ['title']
};
/* tslint:enable:max-line-length */
