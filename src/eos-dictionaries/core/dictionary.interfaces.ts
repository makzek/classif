import { SEARCH_TYPES } from '../consts/search-types';

export enum E_DEPT_MODE {
    person,
    department
};

export enum E_DICT_TYPE {
    linear,
    tree,
    department
};

export enum E_FIELD_SET {
    list,
    quickView,
    shortQuickView,
    search,
    fullSearch,
    edit,
    allVisible
};

export enum E_FIELD_TYPE {
    string,
    number,
    photo,
    text,
    date,
    icon,
    boolean
};

export interface IFieldDesriptor {
    key: string;
    title: string;
    type: string;
    length?: number;
    format?: string;
    foreignKey?: string;
    pattern?: RegExp;
    required?: boolean;
    invalidMessage?: string;
    isUnic?: boolean;
};

export interface IFieldDesriptorBase {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
    readonly foreignKey?: string;
    pattern?: RegExp;
    readonly required?: boolean;
    readonly invalidMessage?: string;
    readonly isUnic?: boolean;
};

export interface IFieldView extends IFieldDesriptorBase {
    value: any;
};

export interface IDictionaryDescriptor {
    id: string;
    dictType: E_DICT_TYPE;
    apiInstance: string;
    title: string;
    actions: string[];
    itemActions: string[];
    groupActions: string[];
    fields: IFieldDesriptor[];
    keyField: string;
    parentField?: string;

    // listFields: string[];
    searchFields: string[];
    searchConfig: SEARCH_TYPES[],
    allVisibleFields: string[];

    /* abstract field sets, depend on dictionary type */
    fullSearchFields: any;
    quickViewFields: any;
    shortQuickViewFields: any;
    editFields: any;
    listFields: any;
};

export interface ITreeDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
};

/* mode for department-like ditionary */
export interface IRecordMode {
    [mode: string]: string[];
};

export interface IRecordModeDescription {
    key: string;
    title: string;
};

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    modeField: string;
    modeList: IRecordModeDescription[];
    fullSearchFields: IRecordMode;
    quickViewFields: IRecordMode;
    shortQuickViewFields: IRecordMode;
    editFields: IRecordMode;
    listFields: IRecordMode;
};
