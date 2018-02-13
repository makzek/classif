import { SEARCH_TYPES } from '../consts/search-types';

export enum E_DEPT_MODE {
    person,
    department,
    cabinet
}

export enum E_DICT_TYPE {
    linear,
    tree,
    department
}

export enum E_FIELD_SET {
    tree,
    list,
    info,
    shortQuickView,
    search,
    fullSearch,
    edit,
    allVisible
}

export enum E_FIELD_TYPE {
    string,
    number,
    photo,
    text,
    date,
    icon,
    boolean,
    dictionary,
    select,
}

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
    unicInDict?: boolean;
    options?: {key: string, value: string}[];
    height?: number;
    forNode?: boolean;
}

export interface IFieldDesriptorBase {
    readonly key: string;
    readonly title: string;
    customTitle?: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
    readonly foreignKey?: string;
    pattern?: RegExp;
    readonly required?: boolean;
    readonly invalidMessage?: string;
    readonly isUnic?: boolean;
    readonly unicInDict?: boolean;
    readonly options?: {key: string, value: string}[];
    readonly height?: number;
    readonly forNode?: boolean;
}

export interface IFieldView extends IFieldDesriptorBase {
    value: any;
}

export interface IDictionaryDescriptor {
    id: string;
    dictType: E_DICT_TYPE;
    apiInstance: string;
    title: string;
    visible?: boolean;
    actions: string[];
    fields: IFieldDesriptor[];
    keyField: string;
    parentField?: string;

    // listFields: string[];
    searchFields: string[];
    searchConfig: SEARCH_TYPES[];
    allVisibleFields: string[];
    treeFields: string[];

    /* abstract field sets, depend on dictionary type */
    fullSearchFields: any;
    quickViewFields: any;
    shortQuickViewFields: any;
    editFields: any;
    listFields: any;
}

export interface ITreeDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
}

/* mode for department-like ditionary */
export interface IRecordMode {
    [mode: string]: string[];
}

export interface IRecordModeDescription {
    key: string;
    title: string;
}

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    modeField: string;
    modeList: IRecordModeDescription[];
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
    fullSearchFields: IRecordMode;
}
