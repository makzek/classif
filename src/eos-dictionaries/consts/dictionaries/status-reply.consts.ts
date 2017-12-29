import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const STATUS_REPLY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'status-reply',
    apiInstance: 'STATUS_REPLY_CL',
    title: 'Состояния исполнения (Исполнителя)',
    visible: true,
});
