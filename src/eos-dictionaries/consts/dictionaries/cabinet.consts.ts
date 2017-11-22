import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const CABINET_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'cabinet',
    apiInstance: 'CABINET',
    title: 'Кабинеты ',
    fields: [{
        key: 'ISN_CABINET',
        type: 'number',
        title: 'ISN кабинета',
        length: 10,
    }, {
        key: 'DUE',
        type: 'string',
        title: 'Код подразделения',
        length: 248,
    }, {
        key: 'CABINET_NAME',
        type: 'string',
        title: 'Имя кабинета',
        length: 64,
    }, {
        key: 'FULLNAME',
        type: 'text',
        title: 'Полное наименование',
        length: 2000,
    }],
});
