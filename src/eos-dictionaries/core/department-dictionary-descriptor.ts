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
import { RecordDescriptor } from './record-descriptor';
import { ModeFieldSet } from './record-mode';
import { IHierCL } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { CB_PRINT_INFO } from 'eos-rest/interfaces/structures';

export class DepartmentRecordDescriptor extends RecordDescriptor {
    dictionary: DepartmentDictionaryDescriptor;
    parentField: FieldDescriptor;
    modeField: FieldDescriptor;
    modeList: IRecordModeDescription[];

    constructor(dictionary: DepartmentDictionaryDescriptor, descriptor: IDepartmentDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
        this.modeField = this.fieldsMap.get(descriptor.modeField);
        if (!this.modeField) {
            throw new Error('No field decribed for "' + descriptor.modeField + '"');
        }

        this.modeList = descriptor.modeList;
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

    _init(descriptor: IDepartmentDictionaryDescriptor) {
        if (descriptor.fields) {
            this.record = new DepartmentRecordDescriptor(this, descriptor);
        }

        this._initModeSets([
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            'fullSearchFields',
            'listFields'
        ], descriptor);
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

    private _initModeSets(setNames: string[], descriptor: IDepartmentDictionaryDescriptor) {
        setNames.forEach((setName) => {
            if (!this[setName]) {
                this[setName] = new ModeFieldSet(this.record, descriptor[setName]);
            }
        })
    }

    addRecord(data: any, parent?: any, isLeaf = false, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(parent, isLeaf, isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        // console.log('create tree node', _newRec);
        return this._postChanges(_newRec, data)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getChildren(isn: string): Promise<any[]> {
        const _children = {
            ['ISN_HIGH_NODE']: isn + ''
        };
        return this.getData({ criteries: _children });
    }

    getRecord(due: string): Promise<any[]> {
        /*
        const res = [];
        const pRec = this.apiSrv.read
        */
        const chain = this.dueToChain(due);
        const recordDue = chain.pop();
        return this.getData(this.dueToChain(due));
    }

    getRelated(rec: any, orgDUE: string): Promise<any> {
        const pUser = this.apiSrv
            .read({ 'USER_CL': PipRX.criteries({ 'DUE_DEP': rec['DUE'] }) })
            .then((items) => this.apiSrv.entityHelper.prepareForEdit(items[0]));

        const pOrganization = (orgDUE) ? this.getCachedRecord({ ORGANIZ_CL: [orgDUE] }) : Promise.resolve(null);

        const pCabinet = (rec['ISN_CABINET']) ? this.getCachedRecord({ 'CABINET': rec['ISN_CABINET'] }) : Promise.resolve(null);

        const pPrintInfo = this.apiSrv
            .read<CB_PRINT_INFO>({
                CB_PRINT_INFO: PipRX.criteries({
                    ISN_OWNER: rec['ISN_NODE'].toString() + '|' + rec['ISN_HIGH_NODE'].toString(),
                    OWNER_KIND: '104'
                })
            })
            .then((items) => this.apiSrv.entityHelper.prepareForEdit(items[0], 'CB_PRINT_INFO'));

        return Promise.all([pUser, pOrganization, pCabinet, pPrintInfo])
            .then(([user, org, cabinet, printInfo]) => {
                return {
                    user: user,
                    organization: org,
                    cabinet: cabinet,
                    printInfo: printInfo
                };
            });
    }

    getRoot(): Promise<any[]> {
        return this.getData({ criteries: { LAYER: '0:2', IS_NODE: '0' } });
    }

    private preCreate(parent?: IHierCL, isLeaf = false, isProtected = false, isDeleted = false): IHierCL {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        const _parentDue = parent.DUE;

        const _res: IHierCL = {
            DUE: _isn + '.',
            PARENT_DUE: null,
            ISN_NODE: _isn,
            ISN_HIGH_NODE: null,
            IS_NODE: (isLeaf ? 1 : 0),
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: 'new_classif_name',
            NOTE: null,
        }

        if (parent) {
            _res.DUE = parent.DUE + _res.DUE;
            _res.PARENT_DUE = parent.DUE;
            _res.ISN_HIGH_NODE = parent.ISN_NODE;
        }
        return _res;
    };
}
