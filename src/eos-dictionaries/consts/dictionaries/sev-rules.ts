import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-rules',
    apiInstance: 'SEV_RULE',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']), // ??
    visible: true,
    title: 'Правила СЭВ (NEW)',
    keyField: 'ISN_LCLASSIF',
    fields: LINEAR_TEMPLATE.fields.concat([{
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
        title: 'FILTER_CONFIG',
        type: 'string',
    }, {
        key: 'SCRIPT_CONFIG',
        title: 'SCRIPT_CONFIG',
        type: 'string'
    }, {
        key: 'DUE_DEP',
        title: 'SCRIPT_CONFIG',
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
        key: 'processing_params',
        type: '',
        title: 'Параметры обработки',
    }]),
    editFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'DUE_DOCGROUP', 'receiver'],
    listFields: ['CLASSIF_NAME', 'DUE_DOCGROUP'],
    allVisibleFields: ['doctype', 'RULE_KIND', 'DUE_DOCGROUP', 'NOTE', 'sender', 'receiver', 'processing_params'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'RULE_KIND', 'DUE_DOCGROUP', 'sender'],
    searchFields: [],
});
