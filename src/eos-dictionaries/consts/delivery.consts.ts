import { ITreeDictionaryDescriptor } from '../core/tree-dictionary-descriptor';
import { NOT_EMPTY_STRING } from './input-validation';
import { SEARCH_TYPES } from './search-types';
/*
*/
export const DELIVERY_DICT: ITreeDictionaryDescriptor = {
    id: 'delivery',
    apiInstance: 'DELIVERY',
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown', 'navigateUp', 'navigateDown'],
    groupActions: ['remove', 'removeHard', 'userOrder', 'showDeleted'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: [{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'RUBRIC_CODE',
        title: 'Код',
        type: 'string',
        required: true,
        length: 248,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Обязательное поле. Максимальная длинна 248 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование',
        type: 'text',
        length: 2000,
        required: true,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Обязательное поле. Максимальная длинна 2000 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'NOTE',
        title: 'Описание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длинна 255 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'CODE',
        title: 'Code',
        type: 'string',
        length: 64,
        invalidMessage: 'Максимальная длинна 64 символа. Пробелы в начале и в конце строки запрещены.'
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
    }, {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'number',
        length: 64,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длинна 64 символа. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'fullTitle',
        title: 'Полное наименование',
        type: 'text',
        length: 2000,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длинна 248 символов. Пробелы в начале и в конце строки запрещены.'
    }],
    editFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'fullTitle', 'sev'],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'fullTitle'],
    quickViewFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['RUBRIC_CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'fullTitle', 'sev'],
};
