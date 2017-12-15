import { E_FIELD_SET, IDictionaryDescriptor, ITreeDictionaryDescriptor } from './dictionary.interfaces';
import { FieldDescriptor } from './field-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { IHierCL } from 'eos-rest';
import { AbstractDictionaryDescriptor } from 'eos-dictionaries/core/abstract-dictionary-descriptor';
import { PipRX } from 'eos-rest/services/pipRX.service';

export class TreeRecordDescriptor extends RecordDescriptor {
    dictionary: TreeDictionaryDescriptor;
    parentField: FieldDescriptor;

    constructor(dictionary: TreeDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
    }
}

export class TreeDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: TreeRecordDescriptor;
    protected fullSearchFields: FieldDescriptor[];
    protected quickViewFields: FieldDescriptor[];
    protected shortQuickViewFields: FieldDescriptor[];
    protected editFields: FieldDescriptor[];
    protected listFields: FieldDescriptor[];

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

    _init(descriptor: ITreeDictionaryDescriptor) {
        if (descriptor.fields) {
            this.record = new TreeRecordDescriptor(this, descriptor);
        }
        this._initFieldSets([
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            'fullSearchFields',
        ], descriptor);
    }

    addRecord(data: any, parent?: any, isLeaf = false, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(parent.rec, isLeaf, isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        // console.log('create tree node', _newRec);
        return this._postChanges(_newRec, data.rec)
            .then((resp) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getChildren(record: IHierCL): Promise<any[]> {
        const _children = {
            ISN_HIGH_NODE: record.ISN_NODE + ''
        };
        return this.getData({ criteries: _children }, 'DUE');
    }

    getSubtree(record: IHierCL): Promise<IHierCL[]> {
        const layer = record.DUE.split('.').length - 1; // calc layer with DUE
        const criteries = {
            DUE: record.DUE + '%',
            LAYER: (layer + 1) + ':' + (layer + 2),
            // IS_NODE: '0'
        };
        return this.getData(PipRX.criteries(criteries));
        // return this.apiSrv.cache.read<IHierCL>({ [this.apiInstance]: {criteries: criteries}, orderby: 'DUE' });
    }

    getRecord(due: string): Promise<any> {
        const chain = this.dueToChain(due);
        const recordDue = chain.pop();
        console.log('read', recordDue, 'read from cache', chain);
        return Promise.all([this.getData([recordDue]), this.apiSrv.cache.read({ [this.apiInstance]: chain })])
            .then(([record, parents]) => {
                return record.concat(parents);
            });
    }

    getRoot(): Promise<any[]> {
        return this.getData({ criteries: { LAYER: '0:2', IS_NODE: '0' } }, 'DUE');
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
