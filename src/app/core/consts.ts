import { IDictionaryDescriptor } from './dictionary-descriptor';
export const SEARCH_KEYS = ['code', 'title', 'description'];

export const BASIC_DICT: IDictionaryDescriptor = {
    id: 'rubricator',
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearh', 'markRecords'],
    itemActions: ['edit', 'view', 'remove', 'removeHard', 'order', 'userOrder', 'quickSearch', 'fullSearh', 'sorting'],
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
