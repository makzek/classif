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
    readonly foreignKey?: string;
    pattern?: RegExp;
    readonly required?: boolean;
    readonly invalidMessage?: string;
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
    readonly foreignKey?: string;
    readonly pattern?: RegExp;
    readonly required?: boolean;
    readonly invalidMessage?: string;

    constructor(data: IFieldDesriptor) {
        if (data.key) {
            this.key = data.key;
            this.title = data.title;
            this.type = E_FIELD_TYPE[data.type];
            this.foreignKey = data.foreignKey;
        }

        if (data.length) {
            this.length = data.length;
        }

        if (data.format) {
            this.format = data.format
        }

        if (data.pattern) {
            this.pattern = data.pattern
        }

        this.required = !!data.required;

        this.invalidMessage = data.invalidMessage || '';
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
