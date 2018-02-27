import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы виз',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
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
        invalidMessage: 'Обязательное поле. Максимальная длинна 64 символа.'
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: 'Максимальная длинна 255 символов.'
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
    }, {
        key: 'IS_FINAL',
        type: 'boolean',
        title: 'Признак финальной визы',
    }, {
        key: 'STATUS',
        type: 'string',
        title: 'Статус визы',
    }],
    quickViewFields: ['IS_FINAL', 'STATUS', 'NOTE'],  // CLASSIF_NAME is in shortQuickViewFields
    allVisibleFields: ['NOTE', 'IS_FINAL', 'STATUS'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'IS_FINAL', 'STATUS']
});
