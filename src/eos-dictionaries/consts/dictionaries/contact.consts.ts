import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { environment } from 'environments/environment';

export const CONTACT_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'contact',
    apiInstance: 'CONTACT',
    title: 'Контакты',
    visible: !environment.production,
    keyField: 'ISN_CONTACT',
    fields: [{
        key: 'ISN_CONTACT',
        type: 'number',
        title: 'ISN контакта',
    }, {
        key: 'ISN_ORGANIZ',
        type: 'number',
        title: 'ISN Организации',
    }, {
        key: 'ORDERNUM',
        type: 'number',
        title: '№ в списке',
    }, {
        key: 'SURNAME',
        type: 'string',
        title: 'ФИО',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'SURNAME_DP',
        type: 'string',
        title: 'ФИО в дательном',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'DUTY',
        type: 'string',
        title: 'Должность',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'DEPARTMENT',
        type: 'string',
        title: 'Подразделение',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'PHONE',
        type: 'string',
        title: 'Телефон городской',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'PHONE_LOCAL',
        type: 'string',
        title: 'Телефон местный',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'FAX',
        type: 'string',
        title: 'Факс',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'E_MAIL',
        type: 'string',
        title: 'E_MAIL',
        length: 255,
        invalidMessage: 'Максимальная длинна 255 символов.',
    }, {
        key: 'EDS_FLAG',
        type: 'boolean',
        title: 'Требуется ЭП',
    }, {
        key: 'ENCRYPT_FLAG',
        type: 'boolean',
        title: 'Требуется шифрование',
    }, {
        key: 'NOTE',
        type: 'string',
        title: 'Примечание',
        length: 2048,
        invalidMessage: 'Максимальная длинна 2048 символов.',
    }, {
        key: 'MAIL_FORMAT',
        type: 'number',
        title: 'Почтовый формат',
    }, {
        key: 'DUE_EXT_DEPARTMENT',
        type: 'string',
        title: 'DUE_EXT_DEPARTMENT',
    }],
    searchFields: [],
    listFields: ['ISN_CONTACT', 'ISN_ORGANIZ', 'SURNAME', 'DUTY'],
    fullSearchFields: [],
    quickViewFields: ['ISN_CONTACT', 'ISN_ORGANIZ', 'SURNAME', 'DUTY', 'DEPARTMENT'],
    shortQuickViewFields: ['SURNAME', 'DUTY'],
    editFields: [],
    allVisibleFields: []
});
