import { IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';

export const  SEV_ASSOCIATION_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-association',
    apiInstance: 'SEV_ASSOCIATION',
    title: 'Индексы СЭВ',
    fields: [{
        key: 'OBJECT_ID',
        type: 'string',
        title: 'Идентификатор в БД',
        length: 255,
    }, {
        key: 'OBJECT_NAME',
        type: 'string',
        title: 'Сущность в БД',
        length: 64,
    }, {
        key: 'GLOBAL_ID',
        type: 'string',
        title: 'Индекс СЭВ',
        length: 255,
    }, {
        key: 'OWNER_ID',
        type: 'string',
        title: 'Владелец',
        length: 255,
    }, {
        key: 'SENDER_ID',
        type: 'string',
        title: 'Отправитель документа',
        length: 255,
    }],
    editFields: ['GLOBAL_ID'],
});
