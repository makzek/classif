import { IFieldDesriptor, IFieldDesriptorBase, E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
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
    readonly unicInDict?: boolean;
    readonly options?: {key: string, value: string}[];
    readonly height?: number;

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

        this.unicInDict = !!data.unicInDict;

        if (data.options) {
            this.options = data.options;
        }

        if (data.height) {
            this.height = data.height;
        }
    }
}
