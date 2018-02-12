import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-rules',
    apiInstance: 'SEV_RULE',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']), // ??
    visible: true,
    title: 'Правила СЭВ',
    keyField: 'ISN_LCLASSIF',
    fields: [{
        key: 'ISN_LCLASSIF',
        type: 'number'
    }, {
        key: 'CLASSIF_NAME',
        type: 'string',
        required: true,
        title: 'Наименование',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'NOTE',
        type: 'text',
        title: 'Примечание',
    }, {
        key: 'doctype',
        type: '',
        title: 'Тип документа',
        required: true,
    }, {
        key: 'RULE_KIND',
        type: 'number',
        title: 'Вид правила',
    }, {
        key: 'DUE_DOCGROUP',
        type: 'string',
        title: 'Группа документов',
    }, {
        key: 'FILTER_CONFIG',
        type: 'string',
    }, {
        key: 'SCRIPT_CONFIG',
        type: 'string'
    }, {
        key: 'WEIGHT',
        type: 'number'
    }, {
        key: 'DUE_DEP',
        type: 'string'
    }, {
        key: 'sender',
        type: '',
        title: 'Отправитель',
    }, {
        key: 'receiver',
        type: '',
        title: 'Получатель',
    }, {
        key: '',
        type: '',
        title: 'Параметры обработки',
    }],
    editFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'DUE_DOCGROUP', 'receiver'],
    listFields: ['CLASSIF_NAME', 'DUE_DOCGROUP', 'NOTE'],
    allVisibleFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'RULE_KIND', 'DUE_DOCGROUP'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'RULE_KIND', 'DUE_DOCGROUP', 'sender'],
    searchFields: [],
});
