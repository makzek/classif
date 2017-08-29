import { IFieldDesriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { RubricatorDictionaryDescriptor } from './rubricator-dictionary-descriptor';

export class RubricatorRecordDescriptor extends RecordDescriptor {
    parent: RubricatorDictionaryDescriptor;

    constructor(dictionary: RubricatorDictionaryDescriptor, fields: IFieldDesriptor[], keyFieldName: string) {
        super(keyFieldName, fields);
        this.parent = dictionary;
    }
}
