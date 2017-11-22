import { E_DICT_TYPE, IDictionaryDescriptor } from '../../core/dictionary.interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';

/* tslint:disable:max-line-length */
export const PRINT_INFO_DICT: IDictionaryDescriptor = {
id: 'printInfo',
apiInstance: 'CB_PRINT_INFO',
dictType: E_DICT_TYPE.linear,
title: '',
actions: ['add'],
itemActions: ['edit'],
groupActions: ['remove', 'removeHard'],
keyField: 'ISN_OWNER',
parentField: 'PARENT_DUE',
searchConfig: [],
fields: [{
    key: 'ISN_OWNER',
    title: 'ISN владельца',
    type: 'number'
}, {
    key: 'OWNER_KIND',
    title: 'Вид владельца',
    type: 'number'
}, {
    key: 'PRINT_SURNAME_DP',
    title: 'Фамилия И.О. в дательном падеже',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PRINT_DUTY',
    title: 'Должность',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 255,
}, {
    key: 'PRINT_DEPARTMENT',
    title: 'Подразделение',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 255,
}, {
    key: 'DEPARTMENT_RP',
    title: 'Наименование в родительном падеже (чего?)',
    type: 'text',
    length: 248,
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'NOT_USE_IN_DUTY',
    title: 'Не использовать подразделение в названии должности',
    type: 'boolean',
}, {
    key: 'SURNAME',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'SURNAME_RP',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME_RP',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON_RP',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'SURNAME_DP',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME_DP',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON_DP',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'SURNAME_VP',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME_VP',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON_VP',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'SURNAME_TP',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME_TP',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON_TP',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'SURNAME_PP',
    title: 'Фамилия',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'NAME_PP',
    title: 'Имя',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'PATRON_PP',
    title: 'Отчество',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 64,
}, {
    key: 'GENDER',
    title: 'Пол',
    type: 'text',
}, {
    key: 'DUTY_RP',
    title: 'Родительный падеж (кого, чего)',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 255,
}, {
    key: 'DUTY_DP',
    title: 'Дательный падеж (кому, чему?)',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 255,
}, {
    key: 'DUTY_VP',
    title: 'Винительный падеж (кого, что?)',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    length: 255,
},

/*NO DISCRIPTION FIELDS*/
 {
    key: 'ISN_LCLASSIF',
    title: 'ISN_CLASSIF',
    type: 'number'
}, {
    key: 'SEV',
    title: 'Индекс СЭВ',
    type: 'text',
    length: 64,
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'INDEX',
    title: 'Индекс',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'alternate',
    title: 'Заместитель',
    type: 'text',
    length: 248,
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'extraData',
    title: 'Дополнительные сведения',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'type',
    title: 'Тип',
    type: 'icon'
}, {
    key: 'iofDP',
    title: 'И.О. Фамилия в дательном падеже',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
}, {
    key: 'titleRoom',
    title: 'Краткое наименование кабинета',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    foreignKey: 'CLASSIF_NAME',
}, {
    key: 'fullTitleRoom',
    title: 'Краткое наименование кабинета',
    type: 'text',
    pattern: NOT_EMPTY_STRING,
    foreignKey: 'fullTitleRoom',
}],
searchFields: [],
listFields: [],
fullSearchFields: [],
quickViewFields: [],
shortQuickViewFields: [],
editFields: [],
allVisibleFields: [],
};
/* tslint:enable:max-line-length */
