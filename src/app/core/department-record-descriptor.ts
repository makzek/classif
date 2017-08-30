import { DepartmentDictionaryDescriptor, IDepartmentDictionaryDescriptor, E_DEPT_MODE } from './department-dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { FieldDescriptor } from './field-descriptor';

export class DepartmentRecordDescriptor extends RecordDescriptor {
    parent: DepartmentDictionaryDescriptor;
    modeField: FieldDescriptor;

    constructor(dictionary: DepartmentDictionaryDescriptor, data: IDepartmentDictionaryDescriptor) {
        /* fields: IFieldDesriptor[], typeFieldName: string */
        super(data.keyField, data.fields);
        this.parent = dictionary;
        this.modeField = this.fieldsMap.get(data.modeField);
        if (!this.modeField) {
            throw new Error('No field decribed for "' + data.modeField + '"');
        }
    }

    getMode(values: any): E_DEPT_MODE {
        /* if IS_NODE or another boolean field */
        if (values[this.modeField.key]) {
            return E_DEPT_MODE.department;
        } else {
            return E_DEPT_MODE.person;
        }
    }
}
