import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { environment } from 'environments/environment';

export const CABINET_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'cabinet',
    apiInstance: 'CABINET',
    title: 'Кабинеты',
    keyField: 'ISN_CABINET',
    visible: !environment.production,
    actions: [],
    /*
    ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization'],
        */
    fields: [{
        key: 'ISN_CABINET',
        type: 'number',
        title: 'ISN кабинета',
        pattern: /^\d*$/,
        length: 10,
        invalidMessage: 'Максимальная длинна 10 символов. Только числовые значения. Пробелы запрещены.',
    }, {
        key: 'DUE',
        type: 'string',
        title: 'Подразделение',
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
    treeFields: ['CABINET_NAME'],
    listFields: ['CABINET_NAME', 'DUE'],
    allVisibleFields: ['FULLNAME', 'CABINET_NAME'],
});
