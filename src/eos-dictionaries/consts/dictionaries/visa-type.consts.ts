import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы виз',
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
        invalidMessage: 'Обязательное поле. Максимальная длинна 64 символа. Пробелы в начале и в конце строки запрещены.'
    }, {
        key: 'NOTE',
        title: 'Описание',
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
    }, {
        key: 'final',
        type: 'boolean',
        title: 'Признак финальной визы',
    }, {
        key: 'status',
        type: 'enum',
        title: 'Статус визы',
    }],
    quickViewFields: ['CLASSIF_NAME', 'final', 'status', 'NOTE'],
});
