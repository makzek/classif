import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'brodcast-chanel',
    apiInstance: '', //
    actions: null,
    visible: true,
    fields: [{
        key: '',
        type: 'string',
        required: true,
        title: 'Организация',
    }, {
        key: '',
        type: 'string',
        title: 'Примечание',
    }, {
        key: '',
        type: '',
        title: 'Канал передачи сообщений',
        required: true,
    }, {
        key: '',
        type: '',
        title: 'Адрес',
    }, {
        key: '',
        type: '',
        title: 'Используемые правила',
    }],
    editFields: []
});
