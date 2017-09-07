import { IRubricatorDictionaryDescriptor } from '../core/rubricator-dictionary-descriptor';

export const RUBRICATOR_DICT: IRubricatorDictionaryDescriptor = {
    id: 'rubricator',
    apiInstance: 'RUBRIC_CL',
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'moveUp', 'moveDown'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown'],
    groupActions: ['remove', 'removeHard', 'userOrder'],
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
    editFields: ['code', 'title', 'description', 'note', 'SEV'],
    searchFields: ['code', 'title', 'description'],
    fullSearchFields: ['code', 'title', 'description'],
    quickViewFields: ['code', 'title', 'description'],
    shortQuickViewFields: ['title'],
    listFields: ['code', 'title']
};
