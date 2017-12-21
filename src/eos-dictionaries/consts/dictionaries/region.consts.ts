import { E_DICT_TYPE, ITreeDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
/*
*/
export const REGION_DICT: ITreeDictionaryDescriptor = {
    id: 'region',
    apiInstance: 'REGION_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Регионы',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization'],
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
        key: 'PARENT_DUE',
        type: 'string',
        title: 'PARENT ID',
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
        title: 'Наименование',
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
        title: 'Код региона',
        pattern: /^\d*$/,
        type: 'number',
        length: 4,
        invalidMessage: 'Максимальная длина 4 символа. Можно вводить только числовые значения. Пробелы запрещены.'
    }, {
        key: 'COD_OKATO',
        title: 'Код ОКАТО',
        type: 'string',
        length: 11,
        invalidMessage: 'Максимальная длина 11 символов. Пробелы в начале и в конце строки запрещены.'
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
        length: 248,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длина 248 символов. Пробелы в начале и в конце строки запрещены.'
    }],
    editFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE'],
    searchFields: [/*'CODE', 'COD_OKATO',*/ 'CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CODE', 'NOTE', 'COD_OKATO'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CODE', 'NOTE', 'COD_OKATO'],
};
