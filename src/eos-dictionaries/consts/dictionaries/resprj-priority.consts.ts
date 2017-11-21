import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const RESPRJ_PRIORITY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'reprj-priority',
    apiInstance: 'RESPRJ_PRIORITY_CL',
    title: 'Приоритеты проекта поручения',
});
