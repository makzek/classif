import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const RESPRJ_STATUS_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'reprj-status',
    apiInstance: 'RESPRJ_STATUS_CL',
    title: 'Статусы проекта поручения',
});
