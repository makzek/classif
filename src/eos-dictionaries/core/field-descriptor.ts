import { IFieldDesriptor, IFieldDesriptorBase, E_FIELD_TYPE } from './dictionary.interfaces';
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
    readonly isUnic?: boolean;

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

        this.isUnic = !!data.isUnic;
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
