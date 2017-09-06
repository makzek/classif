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
    /* column?: number;
    subcolumn?: number;*/
}
/*
export interface IFieldGroup {
    title: string;
    fields: string[];
}
*/
export interface IFieldDesriptorBase {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
};

export interface IFieldView extends IFieldDesriptorBase {
    value: any;
}

export class FieldDescriptor implements IFieldDesriptorBase {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
    /* readonly column?: number;
    readonly subcolumn?: number;*/

    constructor(data: IFieldDesriptor) {
        if (data.key) {
            this.key = data.key;
            this.title = data.title;
            this.type = E_FIELD_TYPE[data.type];
        }

        if (data.length) {
            this.length = data.length;
        }

        if (data.format) {
            this.format = data.format
        }

        /*if (data.column) {
            this.column = data.column
        }

        if (data.subcolumn) {
            this.subcolumn = data.subcolumn
        }*/
    }
}

export class FieldGroup {
    /* readonly index: number; */
    readonly title: string;
    fields: FieldDescriptor[];

    constructor(title: string) {
        this.title = title;
        this.fields = [];
    }
}
