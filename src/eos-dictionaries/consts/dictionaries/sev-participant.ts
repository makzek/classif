import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const PARTICIPANT_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-participant',
    apiInstance: 'SEV_PARTICIPANT (NEW)',
    title: 'Участники СЭВ',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']), // ??
    visible: true,
    keyField: 'ISN_LCLASSIF',
    fields: [{
        key: 'ISN_LCLASSIF',
        type: 'number'
    }, {
        key: 'DUE_ORGANIZ',
        type: 'string',
        required: true,
        title: 'Организация',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'NOTE',
        type: 'string',
        title: 'Примечание',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'ISN_CHANNEL',
        type: 'number',
        title: 'Канал передачи сообщений',
        required: true,
    }, {
        key: 'CLASSIF_NAME',
        type: 'string'
    }, {
        key: 'WEIGHT',
        type: 'number'
    }, {
        key: 'ADDRESS',
        type: 'string',
        title: 'Адрес',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'SEV_PARTICIPANT_RULE_List',
        type: '',
        title: 'Используемые правила',
    }],
    editFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'ADDRESS', 'SEV_PARTICIPANT_RULE_List'],
    listFields: ['DUE_ORGANIZ'],
    allVisibleFields: [],
    quickViewFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'ADDRESS', 'SEV_PARTICIPANT_RULE_List'],
    searchFields: [],
});
