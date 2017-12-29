import {
    E_FIELD_SET,
    E_DEPT_MODE,
    IDepartmentDictionaryDescriptor,
    IRecordModeDescription,
    IDictionaryDescriptor,
    ITreeDictionaryDescriptor,
} from 'eos-dictionaries/interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ModeFieldSet } from './record-mode';
import { IHierCL } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { CB_PRINT_INFO } from 'eos-rest/interfaces/structures';
import { TreeRecordDescriptor, TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';

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
        this._initModeSets([
            'fullSearchFields',
        ], descriptor);
    }

    getMode(values: any): E_DEPT_MODE {
        /* if IS_NODE or another boolean field */
        if (values) {
            if (values.rec[this.modeField.key]) { // 0 - department, 1 - person !!!
                return E_DEPT_MODE.person;
            } else {
                return E_DEPT_MODE.department;
            }
        } else {
            return undefined;
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
            default:
                throw new Error('Unknown field set');
        }
    }

    private _getModeSet(_set: ModeFieldSet, values: any): FieldDescriptor[] {
        //  todo: fix hardcode to data, need better solution
        let _mode: string = E_DEPT_MODE[this.getMode(values)];

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
                this[setName] = new ModeFieldSet(this, descriptor[setName]);
            }
        })
    }
}

export class DepartmentDictionaryDescriptor extends TreeDictionaryDescriptor {
    record: DepartmentRecordDescriptor;
    protected fullSearchFields: ModeFieldSet;
    protected quickViewFields: ModeFieldSet;
    protected shortQuickViewFields: ModeFieldSet;
    protected editFields: ModeFieldSet;
    protected listFields: ModeFieldSet;
    protected allVisibleFields: FieldDescriptor[];

    addRecord(data: any, parent?: any, isLeaf = false, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(parent.rec, isLeaf, isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        // console.log('create tree node', _newRec);
        return this._postChanges(_newRec, data.rec)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getChildren(record: IHierCL): Promise<any[]> {
        const _children = {
            ['ISN_HIGH_NODE']: record['ISN_NODE'] + ''
        };
        return this.getData({ criteries: _children });
    }

    getFullSearchCriteries(data: any): any {
        const _criteries = {};
        const _searchFields = this.fullSearchFields[data['srchMode']]; // this.getFieldSet(E_FIELD_SET.fullSearch);
        switch (data['srchMode']) {
            case 'department':
                _criteries['IS_NODE'] = '0';
                break;
            case 'person':
                _criteries['IS_NODE'] = '1';
                break;
            case 'cabinet':
                _criteries['department.cabinet.CABINET_NAME'] = '"' + data.cabinet['CABINET_NAME'].trim() + '"';
                break;
        }
        if (data['srchMode'] !== 'cabinet') {
            _searchFields.forEach((fld) => {
                if (data.rec[fld.foreignKey]) {
                    _criteries[fld.foreignKey] = '"' + data.rec[fld.foreignKey].trim() + '"';
                }
            })
        }
        return _criteries;
    }

    getSubtree(record: IHierCL): Promise<IHierCL[]> {
        const layer = record.DUE.split('.').length - 1; // calc layer with DUE
        const criteries = {
            DUE: record.DUE + '%',
            LAYER: (layer + 1) + ':' + (layer + 2),
            // IS_NODE: '0'
        };
        return this.getData(PipRX.criteries(criteries));
        // return this.apiSrv.cache.read<IHierCL>({ [this.apiInstance]: { criteries: criteries }, orderby: 'DUE' });
    }

    getRecord(due: string): Promise<any[]> {
        const chain = this.dueToChain(due);
        const recordDue = chain.pop();
        return Promise.all([this.getData([recordDue]), this.apiSrv.cache.read({ [this.apiInstance]: chain })])
            .then(([record, parents]) => {
                return record.concat(parents);
            });
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
        return this.getData({ criteries: { LAYER: '0:2' /*, IS_NODE: '0'*/ } }, 'DUE');
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new DepartmentRecordDescriptor(this, <IDepartmentDictionaryDescriptor>data);
    }

    protected preCreate(parent?: IHierCL, isLeaf = false, isProtected = false, isDeleted = false): IHierCL {
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
