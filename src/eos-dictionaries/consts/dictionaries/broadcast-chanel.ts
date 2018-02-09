import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const BROADCAST_CHANEL_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'brodcast-chanel',
    apiInstance: '', //
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    fields: [{
        key: '',
        type: '',
        title: '',
    }, {
        key: 'CLASSIF_NAME',
        type: 'text',
        length: 0,
        title: 'Наименование',
        required: true,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: '',
    }, {
        key: '',
        type: '',
        length: 0,
        title: 'Примечание'
    }, {
        key: '',
        type: '',
        title: 'Тип канала',
        required: true,
    }, {
        key: '',
        type: '',
        title: 'Параметры доставки'
    }, {
        key: '',
        type: '',
        title: 'E-mail',
        required: true,
        length: 0,
        pattern: '',
        invalidMessage: ''
    }, {
        key: '',
        type: '',
        title: 'SMTP сервер',
        required: true,
        length: 0,
        invalidMessage: ''
    }, {
        key: '',
        type: '',
        title: 'Использовать слудущий тип шифрования:',
        required: true,
        invalidMessage: ''
    }, {
        key: '',
        type: '',
        required: true,
        title: 'Метод аутентификации',
    }, {
        key: '',
        type: '',
        required: true,
        length: 0,
        title: 'SMTP логин',
    }, {
        key: '',
        type: '',
        required: true,
        length: 0,
        title: 'SMTP пароль',
    }, {
        key: '',
        type: '',
        required: true,
        title: 'Задержка, мин',
    },  {
        key: '',
        type: '',
        required: true,
        title: 'POP3 сервер',
        length: 0,
    },  {
        key: '',
        type: '',
        required: true,
        title: 'POP3 порт',
    }, {
        key: '',
        type: '',
        required: true,
        title: 'Требуется шифрование',
    },  {
        key: '',
        type: '',
        required: true,
        length: 0,
        title: 'POP3 логин',
    }, {
        key: '',
        type: '',
        required: true,
        length: 0,
        title: 'POP3 пароль',
    }, {
        key: '',
        type: '',
        required: true,
        title: 'Папка исходящих сообщений',
    },  {
        key: '',
        type: '',
        required: true,
        title: 'Метод входящих сообщений',
    }],
    editFields: []
});
