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
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IPaginationConfig } from '../node-list-pagination/node-list-pagination.interfaces';
import { IImage } from 'eos-dictionaries/interfaces/image.interface';
import { LS_PAGE_LENGTH, PAGES } from '../node-list-pagination/node-list-pagination.consts';

import { WARN_SEARCH_NOTFOUND, WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE, WARN_NO_ORGANIZATION } from '../consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { RestError } from 'eos-rest/core/rest-error';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';
import { IAppCfg } from 'eos-common/interfaces';

@Injectable()
export class EosDictService {
    public viewParameters: IDictionaryViewParameters;

    private dictionary: EosDictionary;
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
    private _dictMode$: BehaviorSubject<number>;
    private _dictionaries: EosDictionary[];
    private _listDictionary$: BehaviorSubject<EosDictionary>;
    private filters: any = {};

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
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
        return this.dictionary && this.dictionary.userOrdered;
    }

    get order() {
        return this.dictionary.orderBy;
    }

    get dictionaryTitle(): string {
        return this.dictionary.title;
    }

    get customFields(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customFields');
        if (_storageData) {
            this._customFields = _storageData;
            if (this._customFields[this.dictionary.id]) {
                return this._customFields[this.dictionary.id];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    get customTitles(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customTitles');
        if (_storageData) {
            this._customTitles = _storageData;
            if (this._customTitles[this.dictionary.id]) {
                return this._customTitles[this.dictionary.id];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    set customFields(val: IFieldView[]) {
        if (!this._customFields) {
            this._customFields = {};
        }
        this._customFields[this.dictionary.id] = val;
        this._storageSrv.setItem('customFields', this._customFields, true);
    }

    set customTitles(val: IFieldView[]) {
        if (!this._customTitles) {
            this._customTitles = {};
        }
        this._customTitles[this.dictionary.id] = val;
        this._storageSrv.setItem('customTitles', this._customTitles, true);
    }

    get dictMode(): number {
        return this._dictMode;
    }

    get haveCabinet(): boolean {
        return true;
    }

    constructor(
        private _msgSrv: EosMessageService,
        // private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        // private _confirmSrv: ConfirmWindowService,
        private _descrSrv: DictionaryDescriptorService,
        private _router: Router,
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
        this._dictMode$ = new BehaviorSubject(0);
        this._dictMode = 0;
    }

    /**
     * @param list Parent nodes
     * @returns node have a flag Boss
     */
    public getBoss(list?: EosDictionaryNode[], newBoss?: EosDictionaryNode): EosDictionaryNode {
        if (this.dictionary.id === 'departments' && this._currentList) {
            return this._currentList.find((node: EosDictionaryNode) => !node.isNode && node.data.rec['POST_H'] === 1);
        } else if (list) {
            return list.find((node: EosDictionaryNode) => {
                return !node.isNode && node.data.rec['POST_H'] === 1 && newBoss.id !== node.id;
            });
        } else {
            return null;
        }
    }

    bindOrganization(orgDue: string) {
        if (orgDue && this.dictionary) {
            return this.dictionary.bindOrganization(orgDue);
        } else {
            return Promise.resolve(null);
        }
    }

    createRepresentative(): Promise<IRecordOperationResult[]> {
        if (this.dictionary && this.treeNode) {
            this.updateViewParameters({ updatingList: true });

            return this.dictionary.getFullNodeInfo(this.treeNode.id)
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
                        return this.dictionary.createRepresentative(represData, this.treeNode);
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
        if (this.dictionary) {
            return this.dictionary.descriptor.getApiConfig();
        } else {
            return null;
        }
    }

    getFilterValue(filterName: string): any {
        return this.filters.hasOwnProperty(filterName) ? this.filters[filterName] : null;
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
        this.dictionary.defaultOrder();
        this._reorderList();
    }

    public closeDictionary() {
        this.dictionary = this.treeNode = this._listNode = this._srchCriteries = null;
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
        this.filters = {};
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        if (this.dictionary && this.dictionary.id === dictionaryId) {
            return Promise.resolve(this.dictionary);
        } else {
            this.updateViewParameters({ showDeleted: false });
            if (this.dictionary) {
                this.closeDictionary();
            }
            return this._openDictionary(dictionaryId);
        }
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        console.warn('direct getNode');
        return this.openDictionary(dictionaryId)
            .then(() => this._getNode(nodeId));
    }

    public loadChildren(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (this.dictionary) {
            return this.dictionary.getChildren(node)
                .then(() => {
                    return node;
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }

    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this.treeNode.id === nodeId) {
            this.updateViewParameters({ updatingList: true });
        }
        return this.dictionary.expandNode(nodeId)
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
    public selectNode(nodeId: string): Promise<EosDictionaryNode> {
        if (nodeId) {
            // console.log('selectNode', nodeId, this.treeNode);
            if (!this.treeNode || this.treeNode.id !== nodeId) {
                // console.log('getting node');
                this.updateViewParameters({ updatingList: true });
                return this._getNode(nodeId)
                    .then((node) => {
                        if (node) {
                            let parent = node.parent;
                            while (parent) {
                                parent.isExpanded = true;
                                parent = parent.parent;
                            }
                        }
                        this.updateViewParameters({ updatingList: false });
                        this._selectNode(node);
                        return node;
                    })
                    .catch(err => this._errHandler(err));
            }
        } else {
            return Promise.resolve(this._selectRoot());
        }
    }

    public openNode(nodeId: string): Promise<EosDictionaryNode> {
        const dictionary = this._dictionaries[this._dictMode];
        if (dictionary) {
            if (!this._listNode || this._listNode.id !== nodeId) {
                this.updateViewParameters({ updatingInfo: true });
                return dictionary.getFullNodeInfo(nodeId)
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
        return this.dictionary.root && this.dictionary.root.id === nodeId;
    }

    public updateNode(node: EosDictionaryNode, data: any): Promise<any> {
        if (node.dictionaryId === 'region') {
            return this.openDictionary(node.dictionaryId)
                .then(() => {
                    const params = { deleted: true, mode: SEARCH_MODES.totalDictionary };
                    const _srchCriteries = this.dictionary.getSearchCriteries(data.rec['CLASSIF_NAME'], params, node);
                    return this.dictionary.descriptor.search(_srchCriteries)
                        .then((nodes) => {
                            const findNode = nodes.find((el: EosDictionaryNode) => {
                                return el['CLASSIF_NAME'].toString().toLowerCase() === data.rec.CLASSIF_NAME.toString().toLowerCase();
                            });
                            if (findNode['DUE'] !== node.data.rec['DUE']) {
                                return Promise.reject('Запись с этим именем уже существует!');
                            } else {
                                return this._updateNode(node, data);
                            }
                        })
                        .catch((err) => this._errHandler(err));
                });
        } else {
            return this._updateNode(node, data);
        }
    }

    public addNode(data: any): Promise<EosDictionaryNode> {
        // Проверка существования записи для регионов.
        if (this.treeNode) {
            let p: Promise<IRecordOperationResult[]>;

            if (this.dictionary.id === 'region') {
                const params = { deleted: true, mode: SEARCH_MODES.totalDictionary };
                const _srchCriteries = this.dictionary.getSearchCriteries(data.rec['CLASSIF_NAME'], params, this.treeNode);

                p = this.dictionary.descriptor.search(_srchCriteries)
                    .then((nodes: EosDictionaryNode[]) =>
                        nodes.find((el: EosDictionaryNode) =>
                            el['CLASSIF_NAME'].toString().toLowerCase() === data.rec.CLASSIF_NAME.toString().toLowerCase())
                    )
                    .then((node: EosDictionaryNode) => {
                        if (node) {
                            return Promise.reject('Запись с этим именем уже существует!');
                        } else {
                            return this.dictionary.descriptor.addRecord(data, this.treeNode.data);
                        }
                    });
            } else {
                // console.log('addNode', data, this.treeNode.data);
                p = this.dictionary.descriptor.addRecord(data, this.treeNode.data);
            }

            return p.then((results) => {
                // console.log('created node', newNodeId);
                return this._reloadList()
                    .then(() => {
                        this._treeNode$.next(this.treeNode);
                        const keyFld = this.dictionary.descriptor.record.keyField.foreignKey;

                        results.forEach((res) => {
                            // console.log(res, keyFld);
                            res.record = this.dictionary.getNode(res.record[keyFld] + '');
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
        if (this.dictionary) {
            this.updateViewParameters({ updatingList: true });
            return this.dictionary.markDeleted(recursive, deleted)
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
        if (this.dictionary) {
            this.updateViewParameters({ updatingList: true });
            return this.dictionary.deleteMarked()
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
        this._srchCriteries = this.dictionary.getSearchCriteries(searchString, params, this.treeNode);
        return this._search();
    }

    setFilter(filter: any) {
        if (filter) {
            Object.assign(this.filters, filter);
            this._reloadList();
        }
    }

    public fullSearch(data: any, params: ISearchSettings) {
        this._srchCriteries = [this.dictionary.getFullsearchCriteries(data, params, this.treeNode)];
        return this._search(params.deleted);
    }

    public getFullNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.openDictionary(dictionaryId)
            .then(() => this.dictionary.getFullNodeInfo(nodeId))
            .then((node) => {
                this._listNode = node;
                return node;
            })
            .catch((err) => this._errHandler(err));
    }

    public orderBy(orderBy: IOrderBy) {
        if (this.dictionary) {
            this.dictionary.orderBy = orderBy;
            this._reorderList();
        }
    }

    public toggleUserOrder(value?: boolean) {
        this.updateViewParameters({
            userOrdered: (value === undefined) ? !this.viewParameters.userOrdered : value
        });


        if (this.dictionary) {
            if (this.viewParameters.userOrdered) {
                this.dictionary.orderBy = null;
            } else {
                this.dictionary.defaultOrder();
            }

            this.dictionary.userOrdered = this.viewParameters.userOrdered;
            this._storageSrv.setUserOrderState(this.dictionary.id, this.dictionary.userOrdered);
        }
        this._reorderList();
    }

    setDictMode(mode: number) {
        this._dictMode = mode;
        if (!this._dictionaries[mode]) {
            this._dictionaries[mode] = this.dictionary.getDictionaryIdByMode(mode);
        }
        /* todo: implement additional dictionary logic */
        this._reloadList();
        this._dictMode$.next(mode);
    }

    setUserOrder(ordered: EosDictionaryNode[]) {
        const _original = [];
        const _move = {};

        // console.log('setUserOrder', this.aToKeys(ordered), this.aToKeys(this._currentList));
        // restore original order
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

        if (this.dictionary && this.treeNode) {
            this.dictionary.setNodeUserOrder(this.treeNode.id, _order);
            this._reorderList();
            this._storageSrv.setUserOrder(this.dictionary.id, this.treeNode.id, _order);
        }
    }

    toggleDeleted() {
        // console.log('toggle deleted fired');
        this.viewParameters.showDeleted = !this.viewParameters.showDeleted;

        if (this.dictionary) {
            this.dictionary.showDeleted = this.viewParameters.showDeleted;
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
        this.updateViewParameters({ haveMarked: val });
    }

    isUnic(val: string, key: string, inDict?: boolean, nodeId?: string): { [key: string]: any } {
        if (inDict) {
            let _hasMatch = false;
            this.dictionary.nodes.forEach((_node) => {
                if (_node.data.rec[key] === val && _node.id !== nodeId) {
                    _hasMatch = true;
                }
            });
            return _hasMatch ? { 'isUnic': _hasMatch } : null;
        } else if (this.treeNode) {
            /* tslint:disable:no-bitwise */
            const _hasMatch = !!~this.treeNode.children.findIndex((_node) => _node.data.rec[key] === val);
            /* tslint:enable:no-bitwise */
            return _hasMatch ? { 'isUnic': _hasMatch } : null;
        } else {
            return null;
        }
    }

    public uploadImg(img: IImage): Promise<number> {
        return this.dictionary.descriptor.addBlob(img.extension, img.data)
            .catch(err => this._errHandler(err));
    }

    public inclineFields(fields: FieldsDecline): Promise<any[]> {
        // console.log(`Method inclineFields: ${fields}`);
        return this.dictionary.descriptor.onPreparePrintInfo(fields)
            .catch((err) => this._errHandler(err));
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
            haveMarked: false
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

    private _getListLength(): number {
        return (this._visibleListNodes) ? this._visibleListNodes.length : 0;
    }

    private _fixCurrentPage() {
        this.paginationConfig.itemsQty = this._getListLength();
        const maxPage = Math.max(1, Math.ceil(this.paginationConfig.itemsQty / this.paginationConfig.length));
        this.paginationConfig.start = Math.min(this.paginationConfig.start, maxPage);
        this.paginationConfig.current = Math.min(this.paginationConfig.current, maxPage);
        this._paginationConfig$.next(this.paginationConfig);
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p: Promise<EosDictionary> = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            try {
                this.dictionary = new EosDictionary(dictionaryId, this._descrSrv);
            } catch (e) {
                return Promise.reject(e);
            }
            if (this.dictionary) {
                this.updateViewParameters({ updatingList: true });
                _p = this.dictionary.init()
                    .then(() => {
                        this._initViewParameters();
                        this._initPaginationConfig();
                        this.updateViewParameters({
                            userOrdered: this._storageSrv.getUserOrderState(this.dictionary.id),
                            markItems: this.dictionary.canMarkItems,
                            updatingList: false
                        });
                        this.dictionary.initUserOrder(
                            this.viewParameters.userOrdered,
                            this._storageSrv.getUserOrder(this.dictionary.id)
                        );
                        this._dictMode = 0;
                        this._dictionaries[0] = this.dictionary;
                        this._mDictionaryPromise.delete(dictionaryId);
                        this._dictionary$.next(this.dictionary);
                        return this.dictionary;
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

    private _getNode(nodeId: string): Promise<EosDictionaryNode> {
        // todo: refactor
        // console.log('get node', nodeId);
        if (this.dictionary) {
            const _node = this.dictionary.getNode(nodeId);
            if (_node) {
                if (_node.loaded) {
                    return Promise.resolve(_node);
                } else {
                    return this.loadChildren(_node);
                }
            } else {
                return this.dictionary.descriptor.getRecord(nodeId)
                    .then((data) => {
                        this._updateDictNodes(data, false);
                        return this.dictionary.getNode(nodeId);
                    })
                    .then((node) => {
                        return this.loadChildren(node);
                    })
                    .catch((err) => this._errHandler(err));
            }
        }
    }

    private _updateDictNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        if (data && data.length) {
            return this.dictionary.updateNodes(data, updateTree);
        } else {
            return null;
        }
    }

    private _setCurrentList(nodes: EosDictionaryNode[], update = false) {
        this._currentList = nodes || [];
        // console.log('_setCurrentList', nodes);
        // remove duplicates
        this._currentList = this._currentList.filter((item, index) => this._currentList.lastIndexOf(item) === index);
        // hide root node
        this._currentList = this._currentList.filter((item) => item.id !== this.dictionary.root.id);
        this._initPaginationConfig(update);
        this._emitListDictionary();
        this._reorderList();
    }

    private _reorderList() {
        // console.log('_reorderList');
        if (this.dictionary) {
            if (!this.viewParameters.searchResults && this.viewParameters.userOrdered && this.treeNode) {
                this._currentList = this.dictionary.reorderList(this._currentList, this.treeNode.id);
            } else {
                this._currentList = this.dictionary.reorderList(this._currentList);
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
            }
            if (node) {
                node.isSelected = true;
            }
            this._listNode = node;
            this._listNode$.next(node);
        }
    }

    private _reloadList(): Promise<any> {
        // console.log('reloading list');
        let pResult = Promise.resolve([]);
        const dictionary = this._dictionaries[this._dictMode];
        if (dictionary) {
            if (this._dictMode !== 0) {
                pResult = dictionary.searchByParentData(this.dictionary, this.treeNode);
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
            .then((list) => this._setCurrentList(list, true))
            .catch((err) => this._errHandler(err));
    }

    private _selectNode(node: EosDictionaryNode) {
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
                this._setCurrentList(node.children);
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
                this._setCurrentList(node.children);
            } else {
                this._setCurrentList([]);
            }
        }
    }

    private _selectRoot(): EosDictionaryNode {
        let node: EosDictionaryNode = null;
        if (this.dictionary && this.dictionary.root) {
            node = this.dictionary.root;
        }
        this._selectNode(node);
        return node;
    }

    private _search(showDeleted = false): Promise<EosDictionaryNode[]> {
        // console.log('full search', critery);
        this._openNode(null);
        this.updateViewParameters({
            updatingList: true
        });
        return this.dictionary.search(this._srchCriteries)
            .then((nodes: any[]) => {
                if (!nodes || nodes.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    this.viewParameters.showDeleted = this.viewParameters.showDeleted || showDeleted;
                }
                this._setCurrentList(nodes);
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
            return null;
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
        this._listDictionary$.next(this._dictionaries[this.dictMode]);
    }

    private _updateNode(node: EosDictionaryNode, data: any): Promise<EosDictionaryNode> {
        let resNode: EosDictionaryNode = null;
        return this.dictionary.updateNodeData(node, data)
            .then((results) => {
                const keyFld = this.dictionary.descriptor.record.keyField.foreignKey;

                results.forEach((res) => {
                    res.record = this.dictionary.getNode(res.record[keyFld] + '');
                    if (!res.success) {
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: res.record.title,
                            msg: res.error.message
                        });
                    } else {
                        resNode = this.dictionary.getNode(node.id);
                    }
                });

            })
            .then((results) => this._reloadList())
            .then(() => resNode)
            .catch((err) => this._errHandler(err));

    }
}
