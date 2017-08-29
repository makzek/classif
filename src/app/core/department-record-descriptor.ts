import { DepartmentDictionaryDescriptor, IDepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
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
}
