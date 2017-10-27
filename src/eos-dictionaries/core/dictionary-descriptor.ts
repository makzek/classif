import { E_DICT_TYPE, E_FIELD_SET, IDictionaryDescriptor } from './dictionary.interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';

export class DictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: RecordDescriptor;
    protected fullSearchFields: FieldDescriptor[];
    protected quickViewFields: FieldDescriptor[];
    protected shortQuickViewFields: FieldDescriptor[];
    protected editFields: FieldDescriptor[];
    protected listFields: FieldDescriptor[];

    constructor(data: IDictionaryDescriptor) {
        super(data);
        this._initFieldSets([
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            'fullSearchFields'
        ], data);
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

    _init(data: IDictionaryDescriptor) {
        if (data.fields) {
            this.record = new RecordDescriptor(this, data);
        }
    }
}
