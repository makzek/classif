import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';

/* mode for department-like ditionary */
export interface IRecordMode {
    [mode: string]: string[];
}

export interface IRecordModeDescription {
    key: string,
    title: string,
}

export class ModeFieldSet {
    [mode: string]: FieldDescriptor[];

    constructor(record: RecordDescriptor, data: IRecordMode) {
        Object.keys(data).forEach((mode) => {
            this[mode] = [];
            data[mode].forEach((fldName) => record.addFieldToSet(fldName, this[mode]));
        });
    }
}
