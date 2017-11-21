import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const DELIVERY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'delivery',
    apiInstance: 'DELIVERY_CL',
    title: 'Виды доставки',
});
