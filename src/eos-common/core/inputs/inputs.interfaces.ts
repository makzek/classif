import { ISelectOption } from '../../interfaces';

export interface IBaseInput {
    controlType?: string;
    key?: string;
    value?: any;
    dict?: string;
    label?: string;
    required?: boolean;
    order?: number;
    pattern?: RegExp;
    readonly?: boolean;
    isUnic?: boolean;
    unicInDict?: boolean;
    hideLabel?: boolean;
    forNode?: boolean;
    options?: any[];
    disabled?: boolean;
}

export interface ISelectInput extends IBaseInput {
    options: ISelectOption[];
}

export interface ICheckboxInput extends IBaseInput {
    disabled: boolean;
    value: boolean;
}
