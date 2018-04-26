import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import {
    IDictionaryViewParameters, ISearchSettings, IOrderBy,
    IDictionaryDescriptor, IFieldView, SEARCH_MODES, IRecordOperationResult
} from 'eos-dictionaries/interfaces';
import { E_DICT_TYPE } from '../interfaces/dictionary.interfaces';
import { EosUtils } from 'eos-common/core/utils';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IPaginationConfig } from '../node-list-pagination/node-list-pagination.interfaces';
import { IImage } from 'eos-dictionaries/interfaces/image.interface';
import { LS_PAGE_LENGTH, PAGES } from '../node-list-pagination/node-list-pagination.consts';

import {
    WARN_SEARCH_NOTFOUND, WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE,
    WARN_NO_ORGANIZATION,
} from '../consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { EosDepartmentsService } from './eos-department-service';
import { RestError } from 'eos-rest/core/rest-error';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';
import { IAppCfg } from 'eos-common/interfaces';
import { CabinetDictionaryDescriptor } from '../core/cabinet-dictionary-descriptor';
import { CONFIRM_CHANGE_BOSS } from '../consts/confirm.consts';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { EosBreadcrumbsService } from 'app/services/eos-breadcrumbs.service';

@Injectable()
export class EosDictService {
    public viewParameters: IDictionaryViewParameters;

    // private dictionary: EosDictionary;
    private treeNode: EosDictionaryNode; // record selected in tree
    private _listNode: EosDictionaryNode; // record selected in list
    private _currentList: EosDictionaryNode[];
    private _visibleListNodes: EosDictionaryNode[];
    private paginationConfig: IPaginationConfig;
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _treeNode$: BehaviorSubject<EosDictionaryNode>;
    private _listNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _visibleList$: BehaviorSubject<EosDictionaryNode[]>;
    private _viewParameters$: BehaviorSubject<IDictionaryViewParameters>;
    private _paginationConfig$: BehaviorSubject<IPaginationConfig>;
    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;
    private _srchCriteries: any[];
    private _customFields: any;
    private _customTitles: any;
    private _dictMode: number;
    private _dictionaries: EosDictionary[];
    private _listDictionary$: BehaviorSubject<EosDictionary>;
    private filters: any = {};
    private currentNode: EosDictionaryNode;

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    get listNode(): EosDictionaryNode {
        return this._listNode;
    }

    get listDictionary$(): Observable<EosDictionary> {
        return this._listDictionary$.asObservable();
    }

    /* Observable treeNode for subscribing on updates in components */
    get treeNode$(): Observable<EosDictionaryNode> {
        return this._treeNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openedNode$(): Observable<EosDictionaryNode> {
        return this._listNode$.asObservable();
    }

    get currentList$(): Observable<EosDictionaryNode[]> {
        return this._currentList$.asObservable();
    }

    get viewParameters$(): Observable<IDictionaryViewParameters> {
        return this._viewParameters$.asObservable();
    }

    get paginationConfig$(): Observable<IPaginationConfig> {
        return this._paginationConfig$.asObservable();
    }

    get visibleList$(): Observable<EosDictionaryNode[]> {
        return this._visibleList$.asObservable();
    }

    get userOrdered(): boolean {
        return this.currentDictionary && this.currentDictionary.userOrdered;
    }

    get order() {
        return this.currentDictionary.orderBy;
    }

    get dictionaryTitle(): string {
        return this._dictionaries[0].title;
    }

    get customFields(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customFields');
        if (_storageData) {
            this._customFields = _storageData;
            if (this._customFields[this.currentDictionary.id]) {
                return this._customFields[this.currentDictionary.id];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    get customTitles(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customTitles');
        const dictionary = this.currentDictionary;
        if (_storageData && dictionary) {
            this._customTitles = _storageData;
            if (this._customTitles[dictionary.id]) {
                return this._customTitles[dictionary.id];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    set customFields(val: IFieldView[]) {
        const dictionary = this.currentDictionary;
        if (!this._customFields) {
            this._customFields = {};
        }
        this._customFields[dictionary.id] = val;
        this._storageSrv.setItem('customFields', this._customFields, true);
    }

    set customTitles(val: IFieldView[]) {
        const dictionary = this.currentDictionary;
        if (!this._customTitles) {
            this._customTitles = {};
        }
        this._customTitles[dictionary.id] = val;
        this._storageSrv.setItem('customTitles', this._customTitles, true);
    }

    get dictMode(): number {
        return this._dictMode;
    }

    get currentDictionary(): EosDictionary {
        return this._dictionaries[this._dictMode];
    }

    constructor(
        private _router: Router,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _descrSrv: DictionaryDescriptorService,
        private departmentsSrv: EosDepartmentsService,
        private confirmSrv: ConfirmWindowService,
        private breadcrSrv: EosBreadcrumbsService,
    ) {
        this._initViewParameters();
        this._dictionaries = [];
        this._treeNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._listNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._listDictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._currentList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._viewParameters$ = new BehaviorSubject<IDictionaryViewParameters>(this.viewParameters);
        this._paginationConfig$ = new BehaviorSubject<IPaginationConfig>(null);
        this._visibleList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._dictMode = 0;
        this.breadcrSrv.setSubdictionary(null);
    }

    bindOrganization(orgDue: string) {
        if (orgDue && this.currentDictionary) {
            return this.currentDictionary.bindOrganization(orgDue);
        } else {
            return Promise.resolve(null);
        }
    }

    createRepresentative(): Promise<IRecordOperationResult[]> {
        const dictionary = this.currentDictionary;
        if (dictionary && this.treeNode) {
            this.updateViewParameters({ updatingList: true });

            return dictionary.getFullNodeInfo(this.treeNode.id)
                .then((_fullData) => {
                    const _represData: any[] = [];
                    if (_fullData && _fullData.data && _fullData.data.organization['ISN_NODE']) {
                        this._visibleListNodes.forEach((_node) => {
                            if (_node.marked && _node.data.rec['IS_NODE']) {
                                _represData.push({
                                    SURNAME: _node.data.rec['SURNAME'],
                                    DUTY: _node.data.rec['DUTY'],
                                    PHONE: _node.data.rec['PHONE'],
                                    PHONE_LOCAL: _node.data.rec['PHONE_LOCAL'],
                                    E_MAIL: _node.data.rec['E_MAIL'],
                                    SEV: _node.data.sev ? _node.data.sev['GLOBAL_ID'] : null, // not sure
                                    ISN_ORGANIZ: _fullData.data.organization['ISN_NODE'],
                                    DEPARTMENT: _fullData.data.rec['CLASSIF_NAME']
                                });
                            }
                        });
                    } else {
                        this._msgSrv.addNewMessage(WARN_NO_ORGANIZATION);
                    }
                    return _represData;
                })
                .then((represData) => {
                    if (represData.length) {
                        return dictionary.createRepresentative(represData, this.treeNode);
                    } else {
                        this._msgSrv.addNewMessage(WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE);
                        return [];
                    }
                })
                .then((res) => {
                    this.updateViewParameters({ updatingList: false });
                    return res;
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve([]);
        }
    }

    getApiConfig(): IAppCfg {
        const dictionary = this.currentDictionary;
        if (dictionary) {
            return dictionary.descriptor.getApiConfig();
        } else {
            return null;
        }
    }

    getCabinetOwners(departmentDue: string): Promise<any[]> {
        return this.getDictionaryById('cabinet')
            .then((dictionary) => {
                const descriptor: CabinetDictionaryDescriptor = <CabinetDictionaryDescriptor>dictionary.descriptor;
                return descriptor.getOwners(departmentDue);
            })
            .catch((err) => this._errHandler(err));
    }

    getFilterValue(filterName: string): any {
        return this.filters.hasOwnProperty(filterName) ? this.filters[filterName] : null;
    }

    isDataChanged(data: any, original: any): boolean {
        const dictionary = this._dictionaries[this._dictMode];
        if (dictionary) {
            return dictionary.descriptor.isDiffer(data, original);
        }
        return false;
    }

    // May be need used always instead this._viewParameters$.next();
    // Because this.viewParametrs is public and may be changed from other classes need way for share state
    public updateViewParameters(updates?: any) {
        Object.assign(this.viewParameters, updates);
        this._viewParameters$.next(this.viewParameters);
    }

    /**
     * Change pagination configuration and share state
     * @param config configuration pagination
     */
    public changePagination(config: IPaginationConfig) {
        Object.assign(this.paginationConfig, config);
        this._updateVisibleNodes();
        this._paginationConfig$.next(this.paginationConfig);
    }

    public getDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._descrSrv.visibleDictionaries());
    }

    public defaultOrder() {
        this.currentDictionary.defaultOrder();
        this._reorderList(this.currentDictionary);
    }

    public closeDictionary() {
        this.treeNode = this._listNode = this._srchCriteries = null;
        this._initViewParameters();
        this._dictMode = 0;
        this._dictionaries = [];
        this._viewParameters$.next(this.viewParameters);
        this._currentList = [];
        this._currentList$.next([]);
        this._visibleList$.next([]);
        this._listNode$.next(null);
        this._treeNode$.next(null);
        this._dictionary$.next(null);
        this._listDictionary$.next(null);
        this.currentNode = null;
        this.filters = {};
        this.breadcrSrv.setSubdictionary(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        if (this._dictionaries[0] && this._dictionaries[0].id === dictionaryId) {
            return Promise.resolve(this._dictionaries[0]);
        } else {
            this.updateViewParameters({ showDeleted: false });
            if (this._dictionaries[0]) {
                this.closeDictionary();
            }
            return this._openDictionary(dictionaryId);
        }
    }

    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this.treeNode.id === nodeId) {
            this.updateViewParameters({ updatingList: true });
        }
        return this._dictionaries[0].expandNode(nodeId)
            .then((val) => {
                this.updateViewParameters({ updatingList: false });
                return val;
            })
            .catch((err) => this._errHandler(err));
    }

    /**
     * @description Mark node selected in tree, updale current list
     * @param nodeId node ID to be selected
     * @returns selected node in current dictionary
     */
    public selectTreeNode(nodeId: string): Promise<EosDictionaryNode> {
        if (nodeId) {
            // console.log('selectTreeNode', nodeId, this.treeNode);
            if (!this.treeNode || this.treeNode.id !== nodeId) {
                // console.log('getting node');
                this.updateViewParameters({ updatingList: true });
                return this.getTreeNode(nodeId)
                    .then((node) => {
                        if (node) {
                            let parent = node.parent;
                            while (parent) {
                                parent.isExpanded = true;
                                parent = parent.parent;
                            }
                        }
                        this.updateViewParameters({ updatingList: false });
                        this._selectTreeNode(node);
                        return node;
                    })
                    .catch(err => this._errHandler(err));
            }
        } else {
            return Promise.resolve(this.selectTreeRoot());
        }
    }

    public openNode(nodeId: string): Promise<EosDictionaryNode> {
        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (!this._listNode || this._listNode.id !== nodeId) {
                this.updateViewParameters({ updatingInfo: true });
                const aNode = dictionary.getNode(nodeId);
                if (aNode) {
                    this._openNode(aNode);
                }
                return this.getFullNode(dictionary.id, nodeId)
                    .then((node) => {
                        this._openNode(node);
                        this.updateViewParameters({ updatingInfo: false });
                        return node;
                    })
                    .catch((err) => this._errHandler(err));
            } else {
                return Promise.resolve(this._listNode);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    public isRoot(nodeId: string): boolean {
        const dictionary = this.currentDictionary;
        return dictionary.root && dictionary.root.id === nodeId;
    }

    public updateNode(node: EosDictionaryNode, data: any): Promise<any> {
        return this.getDictionaryById(node.dictionaryId)
            .then((dictionary) => {
                let resNode: EosDictionaryNode = null;
                return this.preSave(dictionary, data)
                    .then(() => dictionary.updateNodeData(node, data))
                    .then((results) => {
                        const keyFld = dictionary.descriptor.record.keyField.foreignKey;

                        results.forEach((res) => {
                            res.record = dictionary.getNode(res.record[keyFld] + '');
                            if (!res.success) {
                                this._msgSrv.addNewMessage({
                                    type: 'warning',
                                    title: res.record.title,
                                    msg: res.error.message
                                });
                            } else {
                                resNode = dictionary.getNode(node.id);
                            }
                        });

                    })
                    .then(() => this._reloadList())
                    .then(() => resNode);
            })
            .catch((err) => this._errHandler(err));
    }

    public addNode(data: any): Promise<EosDictionaryNode> {
        const dictionary = this.currentDictionary;

        // Проверка существования записи для регионов.
        if (this.treeNode) {
            return this.preSave(dictionary, data)
                .then(() => dictionary.descriptor.addRecord(data, this.treeNode.data))
                .then((results) => {
                    // console.log('created node', newNodeId);
                    return this._reloadList()
                        .then(() => {
                            if (dictionary.descriptor.type !== E_DICT_TYPE.linear) {
                                this._treeNode$.next(this.treeNode);
                                const keyFld = dictionary.descriptor.record.keyField.foreignKey;

                                results.forEach((res) => {
                                    // console.log(res, keyFld);
                                    res.record = dictionary.getNode(res.record[keyFld] + '');
                                    if (!res.success) {
                                        this._msgSrv.addNewMessage({
                                            type: 'warning',
                                            title: res.record ? res.record.title : '',
                                            msg: res.error.message
                                        });
                                    }
                                });
                                if (results[0] && results[0].success) {
                                    return results[0].record;
                                } else {
                                    return null;
                                }
                            }
                        });
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.reject('No selected node');
        }
    }

    toggleAllSubnodes(): Promise<EosDictionaryNode[]> {
        this.updateViewParameters({
            updatingList: true,
            showAllSubnodes: !this.viewParameters.showAllSubnodes,
            searchResults: false
        });

        this._srchCriteries = null;
        return this._reloadList()
            .then((val) => {
                this.updateViewParameters({ updatingList: false });
                return val;
            })
            .catch(err => this._errHandler(err));
    }
    /**
     * @description Marks or unmarks record as deleted
     * @param recursive true if need to delete with children, default false
     * @param deleted true - mark as deleted, false - unmark as deleted
     * @returns Promise<boolean>
     */
    public markDeleted(recursive = false, deleted = true): Promise<boolean> {
        if (this.currentDictionary) {
            this.updateViewParameters({ updatingList: true });
            return this.currentDictionary.markDeleted(recursive, deleted)
                .then(() => this._reloadList())
                .then(() => {
                    this.updateViewParameters({ updatingList: false });
                    return true;
                })
                .catch((err) => this._reloadList().then(() => this._errHandler(err)));
        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * @description Delete marked nodes from dictionary
     */
    public deleteMarked(): Promise<boolean> {
        if (this.currentDictionary) {
            this.updateViewParameters({ updatingList: true });
            return this.currentDictionary.deleteMarked()
                .then((results) => {
                    let success = true;
                    results.forEach((result) => {
                        if (result.error) {
                            if (result.error.code !== 434) {
                                this._msgSrv.addNewMessage({
                                    type: 'warning',
                                    title: 'Ошибка удаления "' + result.record['CLASSIF_NAME'] + '"',
                                    msg: result.error.message
                                });
                                success = false;
                            } else {
                                throw result.error;
                            }
                        }
                    });
                    return this._reloadList()
                        .then(() => {
                            this.updateViewParameters({ updatingList: false });
                            return success;
                        });
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(false);
        }
    }

    public resetSearch(): Promise<any> {
        this._srchCriteries = null;
        return this._reloadList();
    }

    public search(searchString: string, params: ISearchSettings): Promise<EosDictionaryNode[]> {
        const dictionary = this.currentDictionary;
        this._srchCriteries = dictionary.getSearchCriteries(searchString, params, this.treeNode);
        return this._search();
    }

    setFilter(filter: any) {
        if (filter && filter.date) {
            Object.assign(this.filters, filter);
            this._reloadList();
        }
    }

    public fullSearch(data: any, params: ISearchSettings) {
        if (data.srchMode === 'person') {
            this._srchCriteries = [this.currentDictionary.getFullsearchCriteries(data, params, this.treeNode)];
            data.rec['PHONE_LOCAL'] = data.rec['PHONE'];
            delete data.rec['PHONE'];
            this._srchCriteries.push(this.currentDictionary.getFullsearchCriteries(data, params, this.treeNode));
            return this._search(params.deleted);
        } else {
            this._srchCriteries = [this.currentDictionary.getFullsearchCriteries(data, params, this.treeNode)];
            return this._search(params.deleted);
        }
    }

    public getFullNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.getDictionaryById(dictionaryId)
            .then((dictionary) => dictionary.getFullNodeInfo(nodeId))
            .then((node) => this.currentNode = node)
            .catch((err) => this._errHandler(err));
    }

    public orderBy(orderBy: IOrderBy) {
        if (this.currentDictionary) {
            this.currentDictionary.orderBy = orderBy;
            this._reorderList(this.currentDictionary);
        }
    }

    public toggleUserOrder(value?: boolean) {
        this.updateViewParameters({
            userOrdered: (value === undefined) ? !this.viewParameters.userOrdered : value
        });

        const dictionary = this.currentDictionary;

        if (dictionary) {
            if (this.viewParameters.userOrdered) {
                dictionary.orderBy = null;
            } else {
                dictionary.defaultOrder();
            }

            dictionary.userOrdered = this.viewParameters.userOrdered;
            this._storageSrv.setUserOrderState(dictionary.id, dictionary.userOrdered);
        }
        this._reorderList(dictionary);
    }

    setDictMode(mode: number) {
        this._dictMode = mode;
        if (!this._dictionaries[mode]) {
            this._dictionaries[mode] = this._dictionaries[0].getDictionaryIdByMode(mode);
        }

        if (mode) {
            this.breadcrSrv.setSubdictionary(this.currentDictionary.id);
        } else {
            this.breadcrSrv.setSubdictionary(null);
        }

        this._reloadList();
    }

    setUserOrder(ordered: EosDictionaryNode[]) {
        const _original = [];
        const _move = {};

        this._currentList.forEach((node) => {
            const _oNode = ordered.find((item) => item.id === node.id);
            if (_oNode) {
                _original.push(node);
            }
        });

        _original.forEach((node, idx) => {
            _move[node.id] = ordered[idx];
        });

        const _order = this._currentList.map((node) => {
            if (_move[node.id]) {
                return _move[node.id].id;
            } else {
                return node.id;
            }
        });

        const dictionary = this.currentDictionary;

        if (dictionary && this.treeNode) {
            dictionary.setNodeUserOrder(this.treeNode.id, _order);
            this._reorderList(dictionary);
            this._storageSrv.setUserOrder(dictionary.id, this.treeNode.id, _order);
        }
    }

    toggleDeleted() {
        // console.log('toggle deleted fired');
        this.viewParameters.showDeleted = !this.viewParameters.showDeleted;

        if (this.currentDictionary) {
            this.currentDictionary.showDeleted = this.viewParameters.showDeleted;
        }

        if (!this.viewParameters.showDeleted) {
            this._currentList.forEach((node) => {
                if (node.isDeleted) { node.marked = false; }
            });
        }
        this._updateVisibleNodes();
        this.updateViewParameters();
    }

    public markItem(val: boolean) {
        this.updateViewParameters({ hasMarked: val });
    }

    isUnic(val: string, path: string, inDict = false): { [key: string]: any } {
        let records: EosDictionaryNode[] = [];
        let valid = true;
        if ('string' === typeof val) {
            val = val.trim();
        }
        if (val) {
            if (inDict) {
                records = Array.from(this.currentDictionary.nodes.values());
            } else {
                records = this.currentNode ? this.currentNode.neighbors : [];
            }

            records = records.filter((node) => !this.currentNode || node.id !== this.currentNode.id);

            valid = records.findIndex((node) => EosUtils.getValueByPath(node.data, path) === val) === -1;
        }
        return valid ? null : { 'isUnic': !valid };
    }

    public uploadImg(img: IImage): Promise<number> {
        return this.currentDictionary.descriptor.addBlob(img.extension, img.data)
            .catch(err => this._errHandler(err));
    }

    public inclineFields(fields: FieldsDecline): Promise<any[]> {
        // console.log(`Method inclineFields: ${fields}`);
        return this.currentDictionary.descriptor.onPreparePrintInfo(fields)
            .catch((err) => this._errHandler(err));
    }

    private getDictionaryById(id: string): Promise<EosDictionary> {
        const existDict = this._dictionaries.find((dictionary) => dictionary.id === id);
        if (existDict) {
            return Promise.resolve(existDict);
        } else {
            return this.openDictionary(id);
        }
    }

    private _fixCurrentPage() {
        this.paginationConfig.itemsQty = this._getListLength();
        const maxPage = Math.max(1, Math.ceil(this.paginationConfig.itemsQty / this.paginationConfig.length));
        this.paginationConfig.start = Math.min(this.paginationConfig.start, maxPage);
        this.paginationConfig.current = Math.min(this.paginationConfig.current, maxPage);
        this._paginationConfig$.next(this.paginationConfig);
    }
    /**
     * @param list Parent nodes
     * @returns node have a flag Boss
     */
    /*
    private getBoss(data: any): EosDictionaryNode {
        const dictionary = this.currentDictionary;
        if (dictionary.id === 'departments') {
            if (this._listNode) {
                return this._listNode.neighbors.find((node) => !node.isNode && node.data.rec['POST_H'] === 1 && node.id !== data.rec.DUE);
            } else {

            }
        } else {
            return null;
        }
    }
    */

    private _getListLength(): number {
        return (this._visibleListNodes) ? this._visibleListNodes.length : 0;
    }

    private _initViewParameters() {
        // console.log('_initViewParameters');
        this.viewParameters = {
            showAllSubnodes: false,
            showDeleted: false,
            userOrdered: false,
            markItems: false,
            searchResults: false,
            updatingInfo: false,
            updatingList: false,
            hasMarked: false
        };
    }

    /**
     * Initial pagination configuration
     */
    private _initPaginationConfig(update = false) {
        this.paginationConfig = Object.assign(this.paginationConfig || { start: 1, current: 1 }, {
            length: this._storageSrv.getItem(LS_PAGE_LENGTH) || PAGES[0].value,
            itemsQty: this._getListLength()
        });
        if (update) {
            this._fixCurrentPage();
        } else {
            this.paginationConfig.current = 1;
            this.paginationConfig.start = 1;
            this._paginationConfig$.next(this.paginationConfig);
        }
    }

    private loadChildren(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (dictionary) {
            return dictionary.getChildren(node)
                .then(() => node)
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p: Promise<EosDictionary> = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            this._dictMode = 0;
            try {
                this._dictionaries[0] = new EosDictionary(dictionaryId, this._descrSrv);
            } catch (e) {
                return Promise.reject(e);
            }
            if (this._dictionaries[0]) {
                this.updateViewParameters({ updatingList: true });
                _p = this._dictionaries[0].init()
                    .then(() => {
                        this._initViewParameters();
                        this._initPaginationConfig();
                        this.updateViewParameters({
                            userOrdered: this._storageSrv.getUserOrderState(this._dictionaries[0].id),
                            markItems: this._dictionaries[0].canMarkItems,
                            updatingList: false
                        });
                        this._dictionaries[0].initUserOrder(
                            this.viewParameters.userOrdered,
                            this._storageSrv.getUserOrder(this._dictionaries[0].id)
                        );
                        this._mDictionaryPromise.delete(dictionaryId);
                        this._dictionary$.next(this._dictionaries[0]);
                        return this._dictionaries[0];
                    })
                    .catch((err) => {
                        this.closeDictionary();
                        this._mDictionaryPromise.delete(dictionaryId);
                        return this._errHandler(err);
                    });
                this._mDictionaryPromise.set(dictionaryId, _p);
            } else {
                _p = Promise.reject({ message: 'Unknown dictionary "' + dictionaryId + '"' });
            }
        }
        return _p;
    }

    private preSave(dictionary: EosDictionary, data: any): Promise<any> {
        if (data && data.rec) {
            if (dictionary.id === 'departments' && data.rec.IS_NODE) {
                this.departmentsSrv.addDuty(data.rec.DUTY);
                this.departmentsSrv.addFullname(data.rec.FULLNAME);


                if (1 * data.rec.POST_H === 1) {
                    return dictionary.getBoss(data, this.treeNode)
                        .then((boss) => {
                            if (boss && boss.id !== data.rec.DUE) {
                                const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
                                const CLASSIF_NAME = data.rec['SURNAME'] + ' - ' + data.rec['DUTY'];
                                changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['CLASSIF_NAME']);
                                changeBoss.body = changeBoss.body.replace('{{newPersone}}', CLASSIF_NAME);

                                return this.confirmSrv.confirm(changeBoss)
                                    .then((confirm: boolean) => {
                                        if (confirm) {
                                            boss.data.rec['POST_H'] = 0;
                                            return dictionary.updateNodeData(boss, boss.data);
                                        } else {
                                            data.rec['POST_H'] = 0;
                                            return null;
                                        }
                                    });
                            }
                        });
                }
            }

            if (dictionary.id === 'region') {
                const params = { deleted: true, mode: SEARCH_MODES.totalDictionary };
                const _srchCriteries = dictionary.getSearchCriteries(data.rec['CLASSIF_NAME'], params, this.treeNode);

                return dictionary.descriptor.search(_srchCriteries)
                    .then((nodes: EosDictionaryNode[]) =>
                        nodes.find((el: EosDictionaryNode) =>
                            el['CLASSIF_NAME'].toString().toLowerCase() === data.rec.CLASSIF_NAME.toString().toLowerCase())
                    )
                    .then((node: EosDictionaryNode) => {
                        if (node) {
                            return Promise.reject('Запись с этим именем уже существует!');
                        } else {
                            return null;
                        }
                    });
            }
        }
        return Promise.resolve(null);
    }

    private getTreeNode(nodeId: string): Promise<EosDictionaryNode> {
        // todo: refactor
        // console.log('get node', nodeId);
        const dictionary = this._dictionaries[0];
        if (dictionary) {
            const _node = dictionary.getNode(nodeId);
            if (_node) {
                if (_node.loaded) {
                    return Promise.resolve(_node);
                } else {
                    return this.loadChildren(dictionary, _node);
                }
            } else {
                return dictionary.descriptor.getRecord(nodeId)
                    .then((data) => {
                        this._updateDictNodes(dictionary, data, true);
                        return dictionary.getNode(nodeId);
                    })
                    .then((node) => {
                        return this.loadChildren(dictionary, node);
                    })
                    .catch((err) => this._errHandler(err));
            }
        }
    }

    private _updateDictNodes(dictionary: EosDictionary, data: any[], updateTree = false): EosDictionaryNode[] {
        if (data && data.length) {
            return dictionary.updateNodes(data, updateTree);
        } else {
            return null;
        }
    }

    private _setCurrentList(dictionary: EosDictionary, nodes: EosDictionaryNode[], update = false) {
        this._currentList = nodes || [];
        // console.log('_setCurrentList', nodes);
        // remove duplicates
        this._currentList = this._currentList.filter((item, index) => this._currentList.lastIndexOf(item) === index);
        // hide root node
        if (dictionary.root) {
            this._currentList = this._currentList.filter((item) => item.id !== dictionary.root.id);
        }
        this._initPaginationConfig(update);
        this._emitListDictionary();
        this._reorderList(dictionary);
    }

    private _reorderList(dictionary: EosDictionary) {
        // console.log('_reorderList');

        if (dictionary) {
            if (!this.viewParameters.searchResults && this.viewParameters.userOrdered && this.treeNode) {
                this._currentList = dictionary.reorderList(this._currentList, this.treeNode.id);
            } else {
                this._currentList = dictionary.reorderList(this._currentList);
            }
        }
        this._currentList$.next(this._currentList);
        this._updateVisibleNodes();
    }

    private _updateVisibleNodes() {
        // console.log('_updateVisibleNodes');
        this._visibleListNodes = this._currentList;

        if (!this.viewParameters.showDeleted) {
            this._visibleListNodes = this._visibleListNodes.filter((node) => node.isVisible(this.viewParameters.showDeleted));
        }

        this._visibleListNodes = this._visibleListNodes.filter((node) => node.filterBy(this.filters));

        this._fixCurrentPage();

        const page = this.paginationConfig;
        const pageList = this._visibleListNodes.slice((page.start - 1) * page.length, page.current * page.length);
        /* unMark invisible nodes */
        this._currentList
            .filter((listNode) => listNode.marked && pageList.findIndex((pageNode) => pageNode.id === listNode.id) === -1)
            .forEach((listNode) => listNode.marked = false);

        if (this._listNode && pageList.findIndex((node) => node.id === this._listNode.id) < 0) {
            this._openNode(null);
        }
        this._visibleList$.next(pageList);
    }

    private _openNode(node: EosDictionaryNode) {
        if (this._listNode !== node) {
            if (this._listNode) {
                this._listNode.isSelected = false;
                this._listNode.autoMarked = false;
            }
            if (node) {
                node.isSelected = true;
                node.autoMarked = true;
            }
            this._listNode = node;
            this._listNode$.next(node);
        }
    }

    private _reloadList(): Promise<any> {
        // console.log('reloading list');
        let pResult = Promise.resolve([]);
        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (this._dictMode !== 0) {
                pResult = dictionary.searchByParentData(this._dictionaries[0], this.treeNode);
            } else if (this._srchCriteries) {
                pResult = dictionary.search(this._srchCriteries);
            } else if (this.viewParameters.showAllSubnodes) {
                pResult = dictionary.getAllChildren(this.treeNode);
            } else {
                this.viewParameters.searchResults = false;
                pResult = dictionary.getChildren(this.treeNode);
            }
        }

        return pResult
            .then((list) => this._setCurrentList(dictionary, list, true))
            .catch((err) => this._errHandler(err));
    }

    private _selectTreeNode(node: EosDictionaryNode) {
        if (this.treeNode !== node) {
            this._srchCriteries = null;
            this._dictMode = 0;
            if (this.treeNode) {
                if (this.treeNode.children) {
                    this.treeNode.children.forEach((child) => child.marked = false);
                }
                this.treeNode.isActive = false;
            }
            this.treeNode = node;
            if (node) {
                node.isActive = true;
                this._setCurrentList(this.currentDictionary, node.children);
            }
            this._openNode(null);
            this._treeNode$.next(node);
            this.updateViewParameters({
                showAllSubnodes: false,
                searchResults: false
            });
        }

        if (this._currentList === undefined) {
            if (node) {
                this._setCurrentList(this.currentDictionary, node.children);
            } else {
                this._setCurrentList(this.currentDictionary, []);
            }
        }
    }

    private selectTreeRoot(): EosDictionaryNode {
        let node: EosDictionaryNode = null;
        const dictionary = this._dictionaries[0];
        if (dictionary && dictionary.root) {
            node = dictionary.root;
        }
        this._selectTreeNode(node);
        return node;
    }

    private _search(showDeleted = false): Promise<EosDictionaryNode[]> {
        // console.log('full search', critery);
        this._openNode(null);
        this.updateViewParameters({
            updatingList: true
        });
        const dictionary = this.currentDictionary;
        return dictionary.search(this._srchCriteries)
            .then((nodes: any[]) => {
                if (!nodes || nodes.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    this.viewParameters.showDeleted = this.viewParameters.showDeleted || showDeleted;
                }
                this._setCurrentList(dictionary, nodes);
                this.updateViewParameters({
                    updatingList: false,
                    searchResults: true
                });
                return this._currentList;
            })
            .catch((err) => this._errHandler(err));
    }

    private _errHandler(err: RestError | any) {
        this.updateViewParameters({
            updatingInfo: false,
            updatingList: false,
        });
        if (err instanceof RestError && (err.code === 434 || err.code === 0)) {
            this._router.navigate(['login'], {
                queryParams: {
                    returnUrl: this._router.url
                }
            });
            return undefined;
        } else {
            const errMessage = err.message ? err.message : err;
            console.warn(err);
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка обработки. Ответ сервера:',
                msg: errMessage
            });
            return null;
        }
    }

    private _emitListDictionary() {
        this._listDictionary$.next(this.currentDictionary);
    }
}
