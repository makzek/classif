import { FieldDescriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor } from './dictionary-descriptor';
import { RubricatorRecordDescriptor } from './rubricator-record-descriptor';

export interface IRubricatorDictionaryDescriptor extends IDictionaryDescriptor {
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
}

export class RubricatorDictionaryDescriptor extends DictionaryDescriptor {
    record: RubricatorRecordDescriptor;
    quickViewFields: FieldDescriptor[];
    shortQuickViewFields: FieldDescriptor[];
    editFields: FieldDescriptor[];

    constructor(data: IRubricatorDictionaryDescriptor) {
        super(data);
        this._initFieldSets(['quickViewFields', 'shortQuickViewFields', 'editFields'], data);
    }

    _getShortQuickViewFields(values?: any): FieldDescriptor[] {
        return this.shortQuickViewFields;
    }

    _getQuickViewFields(values?: any): FieldDescriptor[] {
        return this.quickViewFields;
    };

    _getEditFields(values?: any): FieldDescriptor[] {
        return this.editFields;
    }

    _init(data: IRubricatorDictionaryDescriptor) {
        if (data.fields) {
            this.record = new RubricatorRecordDescriptor(this, data.fields, data.keyField);
        }
    }
}
