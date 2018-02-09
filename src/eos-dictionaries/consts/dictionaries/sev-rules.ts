import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-rules',
    apiInstance: 'SEV_RULE',
    actions: null,
    visible: true,
    keyField: 'SEV_RULE',
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
        key: '',
        type: '',
        title: 'Отправитель',
    }, {
        key: '',
        type: '',
        title: 'Получатель',
    }, {
        key: '',
        type: '',
        title: 'Параметры обработки',
    }],
    editFields: [],
    listFields: [],
    allVisibleFields: ['CLASSIF_NAME', 'NOTE', 'doctype', 'RULE_KIND', 'DUE_DOCGROUP'],
});
