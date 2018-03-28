import { IFieldDescriptor } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';

export const COMMON_FIELD_CODE: IFieldDescriptor = {
    key: 'CODE',
    title: 'Код',
    type: 'string',
    length: 64,
    pattern: NOT_EMPTY_STRING,
    isUnic: true,
    unicInDict: false,
    invalidMessage: 'Поле должно быть уникально. Максимальная длина 64 символа.',
};

export const COMMON_FIELD_NAME: IFieldDescriptor = {
    key: 'CLASSIF_NAME',
    title: 'Наименование',
    type: 'string',
    length: 250,
    required: true,
    pattern: NOT_EMPTY_STRING,
    invalidMessage: 'Обязательное поле. Максимальная длина 250 символов. Должно быть уникальным в пределах справочника',
    isUnic: true,
    unicInDict: true,
};

export const COMMON_FIELD_FULLNAME: IFieldDescriptor = {
    key: 'FULLNAME',
    title: 'Полное наименование',
    type: 'text',
    length: 2000,
    pattern: NOT_EMPTY_STRING,
    invalidMessage: 'Максимальная длина 2000 символов.'
};

export const COMMON_FIELD_NOTE = {
    key: 'NOTE',
    title: 'Примечание',
    type: 'text',
    length: 255,
    invalidMessage: 'Максимальная длинна 255 символов.'
};

export const COMMON_FIELDS: IFieldDescriptor[] = [{
    key: 'DELETED',
    title: 'Удален логически',
    type: 'number'
}, {
    key: 'PROTECTED',
    title: 'Защищен',
    type: 'number'
}, {
    key: 'WEIGHT',
    title: 'Вес',
    type: 'number'
},
    COMMON_FIELD_NOTE
];
