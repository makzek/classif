import { ITreeDictionaryDescriptor } from '../core/tree-dictionary-descriptor';
import { IDictionaryDescriptor, E_DICT_TYPE } from '../core/dictionary-descriptor';
import { NOT_EMPTY_STRING } from './input-validation';
import { SEARCH_TYPES } from './search-types';
/*
*/
export const DELIVERY_DICT: IDictionaryDescriptor = {
    id: 'delivery',
    apiInstance: 'DELIVERY',
    dictType: E_DICT_TYPE.linear,
    title: 'Рубрикатор',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown', 'navigateUp', 'navigateDown'],
    groupActions: ['remove', 'removeHard', 'userOrder', 'showDeleted'],
    keyField: 'DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: [{
        key: 'ISN_LCLASSIF',
        type: 'number',
        title: 'ID',
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
        key: 'DELETED',
        title: 'DELETED',
        type: 'number'
    }, {
        key: 'PROTECTED',
        title: 'PROTECTED',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'WEIGHT',
        type: 'number'
    }],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CLASSIF_NAME', 'NOTE'],
};
