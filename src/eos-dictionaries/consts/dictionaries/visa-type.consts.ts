import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы визы',
});
