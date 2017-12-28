import { E_DICT_TYPE, IDictionaryDescriptor, E_FIELD_SET, IRecordOperationResult  } from 'eos-dictionaries/interfaces';
import { RecordDescriptor } from 'eos-dictionaries/core/record-descriptor';

import { commonMergeMeta } from 'eos-rest/common/initMetaData';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';
import { ITypeDef, IEnt } from 'eos-rest';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { PrintInfoHelper } from 'eos-rest/services/printInfo-helper';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';


export abstract class AbstractDictionaryDescriptor {
    /**
     * decription of dictionary fields
     */
    abstract record: RecordDescriptor;

    readonly id: string;
    readonly title: string;
    readonly type: E_DICT_TYPE;
    readonly apiInstance: string;
    /**
     * rest metadata. can be used for loading related dictionaries
     */
    protected metadata: ITypeDef;
    /**
     * api service endpoint
     */
    protected apiSrv: PipRX;

    get dictionaryType(): E_DICT_TYPE {
        return this.type;
    }

    constructor(descriptor: IDictionaryDescriptor, apiSrv: PipRX) {
        if (descriptor) {
            this.id = descriptor.id;
            this.title = descriptor.title;
            this.type = descriptor.dictType;
            this.apiInstance = descriptor.apiInstance;

            this.apiSrv = apiSrv;
            commonMergeMeta(this);

            if (descriptor.fields) {
                this.record = new RecordDescriptor(this, descriptor);
            }

            /* this._init(descriptor); */
        } else {
            return undefined;
        }
    }

    merge(metadata: any) {
        this.metadata = metadata[this.apiInstance];
    }

    abstract addRecord(...params): Promise<any>;

    deleteRecord(data: IEnt): Promise<any> {
        return this._postChanges(data, { _State: _ES.Deleted });
    }

    deleteRecords(records: IEnt[]): Promise<IRecordOperationResult[]> {
        const pDelete = records.map((record) => {
            record._State = _ES.Deleted;
            const changes = this.apiSrv.changeList([record]);
            return this.apiSrv.batch(changes, '')
                .then(() => {
                    return <IRecordOperationResult>{
                        record: record,
                        success: true
                    };
                })
                .catch((err) => {
                    return <IRecordOperationResult>{
                        record: record,
                        success: false,
                        error: err
                    };
                });
        });

        return Promise.all(pDelete);
    }

    abstract getChildren(...params): Promise<any[]>;
    abstract getSubtree(...params): Promise<any[]>;

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                return data;
            });
    }

    getFullSearchCriteries(data: any): any {
        const _searchFields = this.record.getFieldSet(E_FIELD_SET.fullSearch);
        const _criteries = {};
        _searchFields.forEach((fld) => {
            if (data.rec[fld.foreignKey]) {
                _criteries[fld.foreignKey] = '"' + data.rec[fld.foreignKey].trim() + '"';
            }
        });
        return _criteries;
    }

    getRelated(rec: any, ...args): Promise<any> {
        const reqs = [];
        this.metadata.relations.forEach((relation) => {
            if (rec[relation.sf]) {
                reqs.push(this.apiSrv
                    .read({
                        [relation.__type]: {
                            criteries: PipRX.criteries({
                                [relation.tf]: rec[relation.sf] + ''
                            })
                        }
                    })
                    .then((records) => this.prepareForEdit(records))
                );
            } else {
                reqs.push(Promise.resolve([]));
            }
        });
        return Promise.all(reqs)
            .then((responses) => {
                return this.aRelationsToObject(responses);
            });
    }

    getRecord(nodeId: string | number): Promise<any> {
        return this.getData([nodeId]);
    }

    abstract getRoot(): Promise<any[]>;

    getRelatedSev(rec: any): Promise<SEV_ASSOCIATION> {
        // todo: fix hardcode
        return this.apiSrv
            .read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['DUE'], this.apiInstance)] })
            .then((sev) => SevIndexHelper.PrepareStub(sev[0], this.apiSrv));
    }

    markDeleted(records: any[], deletedState = 1): Promise<any[]> {
        records.forEach((record) => record.DELETED = deletedState);
        const changes = this.apiSrv.changeList(records);
        return this.apiSrv.batch(changes, '');
    }

    search(criteries: any[]): Promise<any[]> {
        // console.log('search critery', criteries);

        const _search = criteries.map((critery) => this.getData(PipRX.criteries(critery)));

        return Promise.all(_search)
            .then((results) => [].concat(...results));
    }

    /**
     * @description Post chages from all conected dictionaries
     * @param originalData data before changes
     * @param updates changes
     * @returns Promise<any[]>
     */
    updateRecord(originalData: any, updates: any): Promise<any[]> {
        const _res = [];
        const changeData = [];
        for (const key in originalData) {
            if (originalData[key]) {
                if (originalData[key]['_State'] === 'STUB') {
                    if (key === 'sev') {
                        if (SevIndexHelper.PrepareForSave(originalData[key], originalData.rec)) {
                            changeData.push(Object.assign({}, originalData[key], updates[key]));
                        }
                    } else if (key === 'printInfo') {
                        if (PrintInfoHelper.PrepareForSave(originalData[key], originalData.rec)) {
                            changeData.push(Object.assign({}, originalData[key], updates[key]));
                        }
                    } else {
                        changeData.push(Object.assign({}, originalData[key], updates[key]));
                    }
                    // _res.push(this._postChanges(originalData[key], updates[key]));
                } else {
                    changeData.push(Object.assign({}, originalData[key], updates[key]));
                    // _res.push(this._postChanges(originalData[key], updates[key]));
                }
            }
        }
        console.log('changedData originalData', changeData, originalData);
        return this.apiSrv.batch(this.apiSrv.changeList(changeData), '');
        // return Promise.all(_res); // this._postChanges(originalData.rec, updates.rec);
    }

    protected _postChanges(data: any, updates: any): Promise<any[]> {
        console.log('_postChanges', data, updates);
        Object.assign(data, updates);
        const changes = this.apiSrv.changeList([data]);
        console.log('changes', changes);
        return this.apiSrv.batch(changes, '');
    }

    protected dueToChain(due: string): string[] {
        const chain: string[] = due.split('.').filter((elem) => !!elem);
        let prefix = '';
        chain.forEach((elem, idx, arr) => {
            arr[idx] = prefix + elem + '.'
            prefix = arr[idx];
        })
        return chain;
    }

    protected getCachedRecord(query: any): Promise<any> {
        return this.apiSrv.cache
            .read(query)
            .then((items: any[]) => this.apiSrv.entityHelper.prepareForEdit(items[0]));
    }

    protected prepareForEdit(records: any[]): any[] {
        return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    }

    protected aRelationsToObject(responses: any[]): any {
        const related = {};
        this.metadata.relations.forEach((relation, idx) => related[relation.name] = responses[idx]);
        return related;
    }
}
