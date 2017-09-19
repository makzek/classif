import { IRubricatorDictionaryDescriptor } from '../core/rubricator-dictionary-descriptor';
/*
*/
export const RUBRICATOR_DICT: IRubricatorDictionaryDescriptor = {
    id: 'rubricator',
    apiInstance: 'RUBRIC_CL',
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown', 'navigateUp', 'navigateDown'],
    groupActions: ['remove', 'removeHard', 'userOrder', 'showDeleted'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
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
        title: 'Краткое наименование',
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
        type: 'number'
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
    }],
    editFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['RUBRIC_CODE', 'CLASSIF_NAME']
};
