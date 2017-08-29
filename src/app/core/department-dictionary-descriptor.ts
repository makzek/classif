import { FieldDescriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, IRecordMode } from './dictionary-descriptor';
import { DepartmentRecordDescriptor } from './department-record-descriptor';

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    modeField: string;
    quickViewFields: IRecordMode;
    shortQuickViewFields: IRecordMode;
    editFields: IRecordMode;
}

export class DepartmentDictionaryDescriptor extends DictionaryDescriptor {
    record: DepartmentRecordDescriptor;
    quickViewFields: IRecordMode;
    shortQuickViewFields: FieldDescriptor[];
    editFields: FieldDescriptor[];

    constructor(data: IDepartmentDictionaryDescriptor) {
        super(data);
    }

    _init(data: IDepartmentDictionaryDescriptor) {
        if (data.fields) {
            this.record = new DepartmentRecordDescriptor(this, data);
        }
    }

    _getQuickViewFields(): FieldDescriptor[] {
        console.warn('not implemented');
        return [];
    };

    _getShortQuickViewFields(): FieldDescriptor[] {
        console.warn('not implemented');
        return [];
    }

    _getEditFields(): FieldDescriptor[] {
        console.warn('not implemented');
        return [];
    }
}
