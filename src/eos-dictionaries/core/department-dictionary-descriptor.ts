import {
    E_FIELD_SET,
    E_DEPT_MODE,
    IDepartmentDictionaryDescriptor,
    IDictionaryDescriptor,
    ITreeDictionaryDescriptor,
    IRecordMode,
    IRecordModeDescription,
} from './dictionary.interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ModeFieldSet } from './record-mode';

export class DepartmentRecordDescriptor extends RecordDescriptor {
    dictionary: DepartmentDictionaryDescriptor;
    parentField: FieldDescriptor;
    modeField: FieldDescriptor;
    modeList: IRecordModeDescription[];

    constructor(dictionary: DepartmentDictionaryDescriptor, data: IDepartmentDictionaryDescriptor) {
        super(dictionary, data);
        this.dictionary = dictionary;
        this._setCustomField('parentField', data);
        this.modeField = this.fieldsMap.get(data.modeField);
        if (!this.modeField) {
            throw new Error('No field decribed for "' + data.modeField + '"');
        }

        this.modeList = data.modeList;
    }

    getMode(values: any): E_DEPT_MODE {
        /* if IS_NODE or another boolean field */
        if (values) {
            /*if (values[this.modeField.key]) {
                return E_DEPT_MODE.department;
            } else {
                return E_DEPT_MODE.person;
            }*/
            if (values[this.modeField.key]) { // 0 - department, 1 - person !!!
                return E_DEPT_MODE.person;
            } else {
                return E_DEPT_MODE.department;
            }
        } else {
            return undefined;
        }
    }
}

export class DepartmentDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: DepartmentRecordDescriptor;
    fullSearchFields: ModeFieldSet;
    quickViewFields: ModeFieldSet;
    shortQuickViewFields: ModeFieldSet;
    editFields: ModeFieldSet;
    listFields: ModeFieldSet;
    allVisibleFields: FieldDescriptor[];

    constructor(data: IDepartmentDictionaryDescriptor) {
        super(data);
        this._initModeSets([
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            'fullSearchFields',
            'listFields'
        ], data);
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
            /* case E_FIELD_SET.fullSearch:
                return this._getModeSet(this.fullSearchFields, values);*/
            case E_FIELD_SET.allVisible:
                return this._getFieldSet(E_FIELD_SET.allVisible, values);
            default:
                throw new Error('Unknown field set');
        }
    }

    getModeList(): IRecordModeDescription[] {
        return this.record.modeList;
    }


    private _getModeSet(_set: ModeFieldSet, values: any): FieldDescriptor[] {
        /* todo: fix hardcode to data, need better solution */
        let _mode: string = E_DEPT_MODE[this.record.getMode(values)];

        if (!_mode) {
            _mode = E_DEPT_MODE[E_DEPT_MODE.department];
        }

        if (_mode && _set[_mode]) {
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
