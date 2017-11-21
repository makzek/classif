import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const RESOLUTION_CATEGORY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'resolution-category',
    apiInstance: 'RESOLUTION_CATEGORY_CL',
    title: 'Категории поручений',
});
