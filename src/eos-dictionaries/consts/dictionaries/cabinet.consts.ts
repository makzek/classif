import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { environment } from 'environments/environment';

export const CABINET_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'cabinet',
    apiInstance: 'CABINET',
    title: 'Кабинеты',
    keyField: 'ISN_CABINET',
    visible: !environment.production,
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization'],
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
    }, {
        key: 'DEPARTMENT_NAME',
        title: 'Подразделение',
        type: 'text',
        length: 255
    }, {
        key: 'department',
        type: 'dictionary',
        title: 'Подразделение'
    }],
    treeFields: ['CABINET_NAME'],
    listFields: ['CABINET_NAME', 'DEPARTMENT_NAME'],
    allVisibleFields: ['FULLNAME'],
    shortQuickViewFields: ['CABINET_NAME', 'FULLNAME'],
    quickViewFields: ['CABINET_NAME', 'DEPARTMENT_NAME', 'department'],
    editFields: ['CABINET_NAME', 'FULLNAME'],
});

export const CABINET_FOLDERS = [{
    id: 1,
    title: 'Поступившие'
}, {
    id: 2,
    title: 'На исполнении'
}, {
    id: 3,
    title: 'На контроле'
}, {
    id: 4,
    title: 'У руководства'
}, {
    id: 5,
    title: 'На рассмотрении'
}, {
    id: 6,
    title: 'В дело'
}, {
    id: 7,
    title: 'Управление проектам'
}, {
    id: 8,
    title: 'На визировании'
}, {
    id: 9,
    title: 'На подписи'
}];
