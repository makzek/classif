import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const ADDR_CATEGORY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'addr-category',
    apiInstance: 'ADDR_CATEGORY_CL',
    title: 'Категории адресатов',
});
