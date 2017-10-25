import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const ORG_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'org-type',
    apiInstance: 'ORG_TYPE_CL',
    title: 'Формы собственности',
});
