import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { ISelectOption } from 'eos-common/interfaces';

export const STATUS_OPTIONS: ISelectOption[] = [{
    value: 'Положительный',
    title: 'Положительный',
}, {
    value: 'Отрицательный',
    title: 'Отрицательный',
}, {
    value: 'Промежуточный',
    title: 'Промежуточный',
}];

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы виз',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    fields: LINEAR_TEMPLATE.fields.concat([{
        key: 'IS_FINAL',
        type: 'boolean',
        title: 'Признак финальной визы',
    }, {
        key: 'STATUS',
        type: 'select',
        title: 'Статус визы',
        options: STATUS_OPTIONS,
        required: true,
    }]),
    quickViewFields: ['IS_FINAL', 'STATUS', 'NOTE'],  // CLASSIF_NAME is in shortQuickViewFields
    allVisibleFields: ['NOTE', 'IS_FINAL', 'STATUS'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'IS_FINAL', 'STATUS']
});
