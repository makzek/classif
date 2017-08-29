import { FieldDescriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, IRecordMode, ModeFieldSet } from './dictionary-descriptor';
import { DepartmentRecordDescriptor } from './department-record-descriptor';

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    modeField: string;
    quickViewFields: IRecordMode;
    shortQuickViewFields: IRecordMode;
    editFields: IRecordMode;
}

export class DepartmentDictionaryDescriptor extends DictionaryDescriptor {
    record: DepartmentRecordDescriptor;
    quickViewFields: ModeFieldSet;
    shortQuickViewFields: ModeFieldSet;
    editFields: ModeFieldSet;

    constructor(data: IDepartmentDictionaryDescriptor) {
        super(data);
        this._initModeSets(['quickViewFields', 'shortQuickViewFields', 'editFields'], data);
    }

    _init(data: IDepartmentDictionaryDescriptor) {
        if (data.fields) {
            this.record = new DepartmentRecordDescriptor(this, data);
        }
    }

    _getQuickViewFields(values: any): FieldDescriptor[] {
        return this._getModeSet(this.quickViewFields, values);
    };

    _getShortQuickViewFields(values: any): FieldDescriptor[] {
        return this._getModeSet(this.shortQuickViewFields, values);
    }

    _getEditFields(values: any): FieldDescriptor[] {
        return this._getModeSet(this.editFields, values);
    }

    private _getModeSet(_set: ModeFieldSet, values: any): FieldDescriptor[] {
        /* todo: fix hardcode to data, need better solution */
        const _mode: string = values[this.record.modeField.key] ? 'person' : 'department';

        if (_set[_mode]) {
            return _set[_mode];
        } else {
            return [];
        }
    }

    private _initModeSets(setNames: string[], data: IDepartmentDictionaryDescriptor) {
        setNames.forEach((setName) => {
            if (!this[setName]) {
                this[setName] = new ModeFieldSet(this.record, data[setName]);
            }
        })
    }
}
