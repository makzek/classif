import { E_FIELD_SET, IDictionaryDescriptor, ITreeDictionaryDescriptor } from './dictionary.interfaces';
import { FieldDescriptor } from './field-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';

export class TreeRecordDescriptor extends RecordDescriptor {
    dictionary: TreeDictionaryDescriptor;
    parentField: FieldDescriptor;

    constructor(dictionary: TreeDictionaryDescriptor, data: ITreeDictionaryDescriptor) {
        super(dictionary, data);
        this.dictionary = dictionary;
        this._setCustomField('parentField', data);
    }
}

export class TreeDictionaryDescriptor extends DictionaryDescriptor {
    allVisibleFields: FieldDescriptor[];
    _init(data: ITreeDictionaryDescriptor) {
        if (data.fields) {
            this.record = new TreeRecordDescriptor(this, data);
        }
    }
}
