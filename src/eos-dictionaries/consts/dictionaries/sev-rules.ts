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
        title: 'Наименование',
    }, {
        key: '',
        type: 'text',
        title: 'Примечание',
    }, {
        key: '',
        type: '',
        title: 'Тип документа',
        required: true,
    }, {
        key: '',
        type: '',
        title: 'Вид правила',
    }, {
        key: '',
        type: '',
        title: 'Группа документов',
    }, {
        key: '',
        type: '',
        title: 'Отправитель',
    }, {
        key: '',
        type: '',
        title: 'Получатель',
    }, {
        key: '',
        type: '',
        title: 'Параметры обработки',
    }],
    editFields: []
});
