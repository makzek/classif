import { FieldDescriptor /*, IFieldDesriptor */ } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, E_FIELD_SET } from './dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';

export interface ITreeDictionaryDescriptor extends IDictionaryDescriptor {
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
}

export class TreeRecordDescriptor extends RecordDescriptor {
    parent: TreeDictionaryDescriptor;

    constructor(dictionary: TreeDictionaryDescriptor, data: ITreeDictionaryDescriptor) {
        super(data);
        this.parent = dictionary;
    }
}

export class TreeDictionaryDescriptor extends DictionaryDescriptor {
    record: TreeRecordDescriptor;
    protected fullSearchFields: FieldDescriptor[];
    protected quickViewFields: FieldDescriptor[];
    protected shortQuickViewFields: FieldDescriptor[];
    protected editFields: FieldDescriptor[];
    protected listFields: FieldDescriptor[];
    allVisibleFields: FieldDescriptor[];

    constructor(data: ITreeDictionaryDescriptor) {
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

    _init(data: ITreeDictionaryDescriptor) {
        if (data.fields) {
            this.record = new TreeRecordDescriptor(this, data);
        }
    }
}
