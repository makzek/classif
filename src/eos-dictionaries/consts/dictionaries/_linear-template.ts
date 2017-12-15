import { IDictionaryDescriptor, E_DICT_TYPE } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
/*
*/
export const LINEAR_TEMPLATE: IDictionaryDescriptor = {
    id: '',
    apiInstance: '',
    dictType: E_DICT_TYPE.linear,
    title: 'Линейный справочник',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard'],
    itemActions: ['edit', 'view', 'moveUp', 'moveDown', 'navigateUp', 'navigateDown'],
    groupActions: ['remove', 'removeHard', 'userOrder', 'showDeleted'],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick],
    fields: [{
        key: 'ISN_LCLASSIF',
        type: 'number',
        title: 'ID',
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование',
        type: 'text',
        length: 64,
        required: true,
        pattern: NOT_EMPTY_STRING,
        /* tslint:disable:max-line-length */
        invalidMessage: 'Обязательное поле. Максимальная длина 64 символов. Пробелы в начале и в конце строки запрещены. Должно быть уникальным в пределах справочника',
        /* tslint:enable:max-line-length */
        isUnic: true,
        unicInDict: true,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длинна 255 символов. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'DELETED',
        title: 'Логически удален',
        type: 'number'
    }, {
        key: 'PROTECTED',
        title: 'Защищен',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'Вес',
        type: 'number'
    }],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['NOTE'], // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CLASSIF_NAME', 'NOTE'],
};
