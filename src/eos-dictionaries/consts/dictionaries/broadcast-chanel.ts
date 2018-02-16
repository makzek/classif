import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING, EMAIL } from '../input-validation';

export const BROADCAST_CHANEL_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'brodcast-chanel',
    apiInstance: 'SEV_CHANNEL',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    keyField: 'ISN_LCLASSIF',
    title: 'Каналы передачи сообщений (NEW)',
    fields: [{
        key: 'ISN_LCLASSIF',
        type: 'number',
    }, {
        key: 'CLASSIF_NAME',
        type: 'string',
        length: 0,
        title: 'Наименование',
        required: true,
        pattern: NOT_EMPTY_STRING,
        invalidMessage: '',
    }, {
        key: 'NOTE',
        type: 'string',
        length: 0,
        title: 'Примечание'
    }, {
        key: 'CHANNEL_TYPE',
        type: 'string',
        title: 'Тип канала',
        required: true,
    }, {
        key: 'PARAMS',
        type: 'string',
        title: 'Параметры доставки'
    }, {
        key: 'WEIGHT',
        type: 'number'
    }, {
        key: 'email',
        type: 'string',
        title: 'E-mail',
        required: true,
        length: 0,
        pattern: EMAIL,
        invalidMessage: 'Введите корркектынй email адрес!'
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
    editFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE', 'email'],
    listFields: ['CLASSIF_NAME', 'CHANNEL_TYPE'],
    allVisibleFields: ['NOTE', 'PARAMS'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'CHANNEL_TYPE', 'email'],
    searchFields: [],
});
