import { Injector } from '@angular/core';
import { E_DICT_TYPE, IDictionaryDescriptor, E_FIELD_SET, IFieldDesriptor, E_FIELD_TYPE } from './dictionary.interfaces';

import { commonMergeMeta } from 'eos-rest/common/initMetaData';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';
import { ITypeDef, IEnt } from 'eos-rest';

import { FieldDescriptor } from './field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from './record-action';
import { RecordDescriptor } from './record-descriptor';
import { SEARCH_TYPES } from '../consts/search-types';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';

import { EosDictService } from '../services/eos-dict.service';
import { IRecordOperationResult } from 'eos-dictionaries/core/record-operation-result.interface';

export abstract class AbstractDictionaryDescriptor {
    readonly id: string;
    readonly title: string;
    readonly type: E_DICT_TYPE;
    readonly apiInstance: string;
    readonly searchConfig: SEARCH_TYPES[];
    /**
     * rest metadata. can be used for loading related dictionaries
     */
    protected metadata: ITypeDef;
    /**
     * api service endpoint
     */
    protected apiSrv: PipRX;

    /* set of actions available for dictionary */
    private actions: E_RECORD_ACTIONS[];

    /* set of actions available for single record */
    private itemActions: E_RECORD_ACTIONS[];

    /* set of actions available for marked records */
    private groupActions: E_RECORD_ACTIONS[];

    /* decription of dictionary fields */
    abstract record: RecordDescriptor;

    /* set of visible fields in list mode */
    // protected listFields: FieldDescriptor[];
    protected abstract listFields: any;

    /* set of visible fields in quick view mode */
    protected abstract quickViewFields: any;

    /* set of visible fields in quick view (short) mode */
    protected abstract shortQuickViewFields: any;

    /* search fields */
    protected searchFields: FieldDescriptor[];

    /* full search filed set */
    protected abstract fullSearchFields: any;

    /* set of fields for edit form */
    protected abstract editFields: any;

    /* user configurable fields */
    protected allVisibleFields: FieldDescriptor[];

    constructor(descriptor: IDictionaryDescriptor, apiSrv: PipRX) {
        if (descriptor) {
            this.id = descriptor.id;
            this.title = descriptor.title;
            this.type = descriptor.dictType;
            this.apiInstance = descriptor.apiInstance;
            this.searchConfig = descriptor.searchConfig;
            descriptor = this._fillForeignKey(descriptor);

            this.apiSrv = apiSrv;
            commonMergeMeta(this);

            this._init(descriptor);
            this._initActions(descriptor);
            this._initFieldSets(['searchFields', 'allVisibleFields'], descriptor);
        } else {
            return undefined;
        }
    }

    merge(metadata: any) {
        this.metadata = metadata[this.apiInstance];
    }

    private _fillForeignKey(descriptor: IDictionaryDescriptor): IDictionaryDescriptor {
        // console.log('dict descript', descriptor);
        descriptor.fields.forEach(field => {
            if (!field.foreignKey) {
                field.foreignKey = field.key;
            }
        });

        return descriptor;
    }

    canDo(group: E_ACTION_GROUPS, action: E_RECORD_ACTIONS): boolean {
        /* tslint:disable:no-bitwise */
        return !!~this.actions.findIndex((a) => a === action);
        /* tslint:enable:no-bitwise */
    }

    get dictionaryType(): E_DICT_TYPE {
        return this.type;
    }

    getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        return this._getFieldSet(aSet, values);
    }

    getFieldDescription(aSet: E_FIELD_SET, data?: any): any {
        const _description = {
            rec: {}
        };
        const _descs = this.getFieldSet(aSet, data);
        if (_descs) {
            _descs.forEach((_f) => {
                if (_f.type !== E_FIELD_TYPE.dictionary) {
                    _description.rec[_f.key] = {
                        title: _f.title,
                        length: _f.length,
                        pattern: _f.pattern,
                        required: _f.required,
                        invalidMessage: _f.invalidMessage,
                        isUnic: _f.isUnic,
                        unicInDict: _f.unicInDict,
                    }
                } else {
                    _description[_f.key] = {};
                    /* recive other dict description */
                    // this.dictSrv.getDictionaryField(_f.key);
                }
            });
        }
        return _description;
    }

    getSearchConfig(): SEARCH_TYPES[] {
        return this.searchConfig;
    }

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        switch (aSet) {
            case E_FIELD_SET.search:
                return this._getSearchFields();
            case E_FIELD_SET.allVisible:
                return this._getAllVisibleFields();
            default:
                return null;
        }
    }

    getModeList() {
        return null;
    }

    getFieldView(aSet: E_FIELD_SET, mode?: string) {
        return this._getFieldView(aSet, mode);
    }

    protected _getFieldView(aSet: E_FIELD_SET, mode?: string): any {
    }

    abstract _init(descriptor: IDictionaryDescriptor);

    private _getListFields(): FieldDescriptor[] {
        return this.listFields;
    }

    private _getSearchFields(): FieldDescriptor[] {
        return this.searchFields;
    }

    private _getAllVisibleFields(): FieldDescriptor[] {
        return this.allVisibleFields;
    }

    private _getFullSearchFields() {
        return this.fullSearchFields;
    }

    private _addAction(name: string, group: E_RECORD_ACTIONS[]) {
        const _action = E_RECORD_ACTIONS[name];
        /* tslint:disable:no-bitwise */
        if (_action !== undefined && !~group.findIndex((a) => a === _action)) {
            group.push(_action);
        }
        /* tslint:enable:no-bitwise */
    };

    private _initActions(descriptor: IDictionaryDescriptor) {
        const actKeys = ['actions', 'itemActions', 'groupActions'];

        actKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (descriptor[foreignKey]) {
                descriptor[foreignKey].forEach((actName) => this._addAction(actName, this[foreignKey]));
            }
        })
    }

    protected _initFieldSets(fsKeys: string[], descriptor: IDictionaryDescriptor) {
        fsKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (descriptor[foreignKey]) {
                descriptor[foreignKey].forEach((fldName) => this.record.addFieldToSet(fldName, this[foreignKey]));
            }
        });
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

    updateRecord(originalData: any, updates: any): Promise<any[]> {
        return this._postChanges(originalData.rec, updates.rec);
    }

    protected _postChanges(data: any, updates: any): Promise<any[]> {
        // console.log('_postChanges', data, updates);
        Object.assign(data, updates);
        const changes = this.apiSrv.changeList([data]);
        // console.log('changes', changes);
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
