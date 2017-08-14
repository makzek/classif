export enum E_FIELD_TYPE {
    string,
    number,
    photo,
    text,
    date
};

export interface IFieldDesriptor {
    key: string;
    title: string;
    type: string;
    length?: number;
    format?: string;
}

export interface IFieldGroup {
    title: string;
    fields: string[];
}

export class FieldDescriptor {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;

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
