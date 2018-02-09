import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'brodcast-chanel',
    apiInstance: '', //
    actions: null,
    visible: true,
    fields: [{
        key: '',
        type: 'string',
        required: true,
        title: '№',
    }, {
        key: '',
        type: 'string',
        title: 'Название коллизии',
    }, {
        key: '',
        type: '',
        title: 'Способ разрешения',
        required: true,
    }],
    editFields: []
});
