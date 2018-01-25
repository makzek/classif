import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { IHierCL, SEV_ASSOCIATION, CB_PRINT_INFO } from 'eos-rest';
import { AbstractDictionaryDescriptor } from 'eos-dictionaries/core/abstract-dictionary-descriptor';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { PrintInfoHelper } from 'eos-rest/services/printInfo-helper';
import { FieldsDecline } from '../interfaces/fields-decline.inerface';

export class TreeRecordDescriptor extends RecordDescriptor {
    dictionary: TreeDictionaryDescriptor;
    parentField: FieldDescriptor;

    constructor(dictionary: TreeDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}

export class TreeDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: TreeRecordDescriptor;

    addRecord<T extends IHierCL>(data: any, parent?: any, isLeaf = false, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(parent.rec, isLeaf, isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<T>(_newRec, this.apiInstance);
        // console.log('create tree node', _newRec);
        return this._postChanges(_newRec, data.rec)
            .then((resp) => {
                if (resp && resp[0]) {
                    data.rec = Object.assign(_newRec, data.rec);
                    if (resp[0].ID !== undefined) {
                        data.rec['DUE'] = resp[0].ID;
                    }
                    if (resp[0].FixedISN !== undefined) {
                        data.rec['ISN_NODE'] = resp[0].FixedISN;
                    }
                    const changeData = [];

                    Object.keys(data).forEach((key) => {
                        if (key !== 'rec' && data[key]) {
                            switch (key) {
                                case 'sev':
                                    const sevRec = this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(undefined, 'SEV_ASSOCIATION');
                                    data[key] = Object.assign(sevRec, data[key]);
                                    if (SevIndexHelper.PrepareForSave(data[key], data.rec)) {
                                        changeData.push(data[key]);
                                    }
                                    break;
                                case 'printInfo':
                                    const printInfoRec = this.apiSrv.entityHelper.prepareForEdit<CB_PRINT_INFO>(undefined, 'CB_PRINT_INFO');
                                    data[key] = Object.assign(printInfoRec, data[key]);
                                    if (PrintInfoHelper.PrepareForSave(data[key], data.rec)) {
                                        changeData.push(data[key]);
                                        break;
                                    }
                            }
                        }
                    });
                    if (changeData.length) {
                        return this.apiSrv.batch(this.apiSrv.changeList(changeData), '')
                            .then(() => {
                                return resp[0].ID;
                            });
                    } else {
                        return resp[0].ID;
                    }
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

    getRecord(due: string): Promise<any> {
        const chain = this.dueToChain(due);
        return this.getData(chain);
        /*
        do not read from cache!!!!
        const recordDue = chain.pop();
        // console.log('read', recordDue, 'read from cache', chain);
        return Promise.all([this.getData([recordDue]), this.apiSrv.cache.read({ [this.apiInstance]: chain })])
            .then(([record, parents]) => record.concat(parents));
        */
    }

    getRoot(): Promise<any[]> {
        return this.getData({ criteries: { LAYER: '0:2'/*, IS_NODE: '0'*/ } }, 'DUE');
    }

    getSubtree(record: IHierCL): Promise<IHierCL[]> {
        const layer = record.DUE.split('.').length - 1; // calc child layer with DUE
        // console.log('child layers', layer, layer + 1);
        const criteries = {
            DUE: record.DUE + '%',
            LAYER: (layer) + ':' + (layer + 1),
            // IS_NODE: '0'
        };
        return this.getData(PipRX.criteries(criteries));
        // return this.apiSrv.cache.read<IHierCL>({ [this.apiInstance]: {criteries: criteries}, orderby: 'DUE' });
    }

    public onPreparePrintInfo(_dec: FieldsDecline): Promise<any> {
        return Promise.reject('Type of dictionary not true!');
    }

    protected _initRecord(data: ITreeDictionaryDescriptor) {
        this.record = new TreeRecordDescriptor(this, data);
    }

    protected preCreate(parent?: IHierCL, isLeaf = false, isProtected = false, isDeleted = false): IHierCL {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();

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
        };

        if (parent) {
            _res.DUE = parent.DUE + _res.DUE;
            _res.PARENT_DUE = parent.DUE;
            _res.ISN_HIGH_NODE = parent.ISN_NODE;
        }
        return _res;
    }
}
