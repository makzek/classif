import { FieldDescriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, IRecordMode, ModeFieldSet, E_FIELD_SET } from './dictionary-descriptor';
import { DepartmentRecordDescriptor } from './department-record-descriptor';

export enum E_DEPT_MODE {
    person,
    department
}

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    modeField: string;
    fullSearchFields: IRecordMode;
    quickViewFields: IRecordMode;
    shortQuickViewFields: IRecordMode;
    editFields: IRecordMode;
    listFields: IRecordMode;
}

export class DepartmentDictionaryDescriptor extends DictionaryDescriptor {
    record: DepartmentRecordDescriptor;
    fullSearchFields: ModeFieldSet;
    quickViewFields: ModeFieldSet;
    shortQuickViewFields: ModeFieldSet;
    editFields: ModeFieldSet;
    listFields: ModeFieldSet;

    constructor(data: IDepartmentDictionaryDescriptor) {
        super(data);
        this._initModeSets(['quickViewFields', 'shortQuickViewFields', 'editFields', 'listFields', 'fullSearchFields', 'listFields'], data);
    }

    _init(data: IDepartmentDictionaryDescriptor) {
        if (data.fields) {
            this.record = new DepartmentRecordDescriptor(this, data);
        }
    }

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        const _res = super._getFieldSet(aSet, values);
        if (_res) {
            return _res;
        }
        switch (aSet) {
            case E_FIELD_SET.fullSearch:
                let __res = [];
                Object.keys(this.fullSearchFields).forEach((mode) => {
                    __res = __res.concat(__res, this.fullSearchFields[mode]);
                })
                return __res;
            case E_FIELD_SET.quickView:
                return this._getModeSet(this.quickViewFields, values);
            case E_FIELD_SET.shortQuickView:
                return this._getModeSet(this.shortQuickViewFields, values);
            case E_FIELD_SET.edit:
                return this._getModeSet(this.editFields, values);
            case E_FIELD_SET.list:
                return this._getModeSet(this.listFields, values);
            case E_FIELD_SET.fullSearch:
                return this._getModeSet(this.fullSearchFields, values);
            default:
                throw new Error('Unknown field set');
        }
    }


    private _getModeSet(_set: ModeFieldSet, values: any): FieldDescriptor[] {
        /* todo: fix hardcode to data, need better solution */
        const _mode: string = E_DEPT_MODE[this.record.getMode(values)];

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
