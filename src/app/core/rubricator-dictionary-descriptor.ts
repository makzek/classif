import { FieldDescriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, E_FIELD_SET } from './dictionary-descriptor';
import { RubricatorRecordDescriptor } from './rubricator-record-descriptor';

export interface IRubricatorDictionaryDescriptor extends IDictionaryDescriptor {
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
}

export class RubricatorDictionaryDescriptor extends DictionaryDescriptor {
    record: RubricatorRecordDescriptor;
    protected fullSearchFields: FieldDescriptor[];
    protected quickViewFields: FieldDescriptor[];
    protected shortQuickViewFields: FieldDescriptor[];
    protected editFields: FieldDescriptor[];
    protected listFields: FieldDescriptor[];

    constructor(data: IRubricatorDictionaryDescriptor) {
        super(data);
        this._initFieldSets(['quickViewFields', 'shortQuickViewFields', 'editFields', 'listFields', 'fullSearchFields'], data);
    }

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        const _res = super._getFieldSet(aSet, values);
        if (_res) {
            return _res;
        }
        switch (aSet) {
            case E_FIELD_SET.fullSearch:
                return this.fullSearchFields;
            case E_FIELD_SET.quickView:
                return this.quickViewFields;
            case E_FIELD_SET.shortQuickView:
                return this.shortQuickViewFields;
            case E_FIELD_SET.edit:
                return this.editFields;
            case E_FIELD_SET.list:
                return this.listFields;
            default:
                throw new Error('Unknown field set');
        }
    }

    _init(data: IRubricatorDictionaryDescriptor) {
        if (data.fields) {
            this.record = new RubricatorRecordDescriptor(this, data.fields, data.keyField);
        }
    }
}
