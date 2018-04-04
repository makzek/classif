
import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_CODE, COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME } from './_common';

export const DOCGROUP_DICT: ITreeDictionaryDescriptor = {
    id: 'docgroup',
    apiInstance: 'DOCGROUP_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Группы документов',
    visible: true,
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'
    ],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    },
        COMMON_FIELD_CODE,
        COMMON_FIELD_NAME,
        COMMON_FIELD_FULLNAME,
    {
        key: 'IS_COPYCOUNT',
        title: 'Признак нумерации копий',
        type: 'boolean',
    }, {
        key: 'RC_TYPE',
        title: 'Вид РК',
        type: 'number',
    }, {
        key: 'DOCGROUP_INDEX',
        title: 'Индекс группы',
        type: 'string',
    }, {
        key: 'DOCNUMBER_FLAG',
        title: 'Признак образования номеров',
        type: 'number',
    }, {
        key: 'SHABLON',
        title: 'Шаблон номера документа',
        type: 'string',
    }, {
        key: 'EDS_FLAG',
        title: 'Требуется ЭП',
        type: 'number',
    }, {
        key: 'ENCRYPT_FLAG',
        title: 'Требуется шифрование',
        type: 'number',
    }, {
        key: 'TEST_UNIQ_FLAG',
        title: 'Проверять уникальность',
        type: 'number',
    }, {
        key: 'PRJ_NUM_FLAG',
        title: 'Разрешение создания РКПД',
        type: 'number',
    }, {
        key: 'PRJ_SHABLON',
        title: 'Шаблон номера проекта документа',
        type: 'string',
    }, {
        key: 'PRJ_WEIGHT',
        title: 'Вес в списке для проектов',
        type: 'number',
    }, {
        key: 'PRJ_AUTO_REG',
        title: 'Авторегистрация проекта',
        type: 'number',
    }, {
        key: 'PRJ_APPLY_EDS',
        title: 'Применять ЭП для подписания проекта',
        type: 'number',
    }, {
        key: 'PRJ_APPLY2_EDS',
        title: 'Применять ЭП для визирования проекта',
        type: 'number',
    }, {
        key: 'PRJ_APPLY_EXEC_EDS',
        title: 'Применять ЭП для исполнителя проекта',
        type: 'number',
    }, {
        key: 'PRJ_DEL_AFTER_REG',
        title: 'Удалять РК проекта после регистрации',
        type: 'number',
    }, {
        key: 'PRJ_TEST_UNIQ_FLAG',
        title: 'Флаг проверки уникальности номера проекта',
        type: 'number',
    }, {
        key: 'E_DOCUMENT',
        title: 'Электронный документ',
        type: 'number',
    }, {
        key: 'ACCESS_MODE',
        title: 'Конфиденциальность',
        type: 'number',
    }, {
        key: 'ACCESS_MODE_FIXED',
        title: 'Без редактирования',
        type: 'number',
    }, {
        key: 'INITIATIVE_RESOLUTION',
        title: 'флаг Инициативная резолюция',
        type: 'number',
    }, {
        key: 'AR_DOCGROUP_List',
        title: 'список используемых для этой группы документов дополнительных реквизитов',
        type: 'AR_DOCGROUP[]',
    }, {
        key: 'DG_FILE_CONSTRAINT_List',
        title: 'список используемых для этой группы документов ограничений на файлы',
        type: 'DG_FILE_CONSTRAINT[]',
    }, {
        key: 'DOC_DEFAULT_VALUE_List',
        title: 'список используемых для этой группы документов дополнительных реквизитов РК',
        type: 'DOC_DEFAULT_VALUE[]',
    }, {
        key: 'PRJ_DEFAULT_VALUE_List',
        title: 'список используемых для этой группы документов правил заполнения реквизитов РКПД',
        type: 'PRJ_DEFAULT_VALUE[]',
    }, {
        key: 'SHABLON_DETAIL_List',
        title: 'список используемых для этой группы документов ограничений шаблонов номерообразования',
        type: 'SHABLON_DETAIL[]',
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE'],
    searchFields: ['CODE', 'CLASSIF_NAME'/*, 'NOTE'*/],
    fullSearchFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'DOCGROUP_INDEX', 'NOTE'],
    quickViewFields: ['FULLNAME', 'NOTE'],  // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'FULLNAME'],
};
