export enum E_FIELD_TYPE {
    string,
    number,
    photo
};

export class FieldDescriptor {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly iconClass?: string;
    readonly dataSrc?: string;

    constructor(data: any) {

    }
}

export class FieldGroup {
    readonly index: number;
    readonly title: string;
    fields: FieldDescriptor[];

    constructor(title: string) {

    }
}
