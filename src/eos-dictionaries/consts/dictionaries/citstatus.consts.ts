import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
/*
*/
export const CITSTATUS_DICT: ITreeDictionaryDescriptor = {
    id: 'cistatus',
    apiInstance: 'CITSTATUS_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Справочник статусов граждан',
    visible: true,
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick /*, SEARCH_TYPES.full*/],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Parent ID',
        length: 248,
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'ISN_HIGH_NODE',
        type: 'number'
    }, {
        key: 'LAYER',
        title: 'LAYER',
        type: 'number'
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование статуса',
        type: 'text',
        length: 64,
        required: true,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Обязательное поле. Максимальная длина 64 символа. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 255 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'CODE',
        title: 'Код',
        type: 'string',
        length: 64,
        invalidMessage: 'Максимальная длина 64 символа. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'DELETED',
        title: 'DELETED',
        type: 'number'
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }, {
        key: 'PROTECTED',
        title: 'PROTECTED',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'WEIGHT',
        type: 'number'
    }, {
        key: 'MAXDUE',
        title: 'MAX значение кода Дьюи',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 64 символа. Пробелы в начале и в конце строки запрещены.'
    }],
    editFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    searchFields: ['CODE', 'CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE'],
};
