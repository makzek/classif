import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters } from '../core/eos-dictionary.interfaces';
import { ISearchSettings } from '../core/search-settings.interface';
import { IPaginationConfig, IPageLength } from '../node-list-pagination/node-list-pagination.interfaces';
import { LS_PAGE_LENGTH, PAGES } from '../node-list-pagination/node-list-pagination.consts';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { WARN_SEARCH_NOTFOUND, DANGER_LOGICALY_RESTORE_ELEMENT } from '../consts/messages.consts';
import { LS_USE_USER_ORDER } from '../consts/common';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosUserProfileService } from 'app/services/eos-user-profile.service';
import { IOrderBy } from '../core/sort.interface'
import { EosStorageService } from 'app/services/eos-storage.service';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SUBNODES_RESTORE } from 'app/consts/confirms.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/core/dictionary.interfaces';
import { IFieldView } from 'eos-dictionaries/core/dictionary.interfaces';
import { RestError } from 'eos-rest/core/rest-error';

@Injectable()
export class EosDictService {
    public viewParameters: IDictionaryViewParameters;
    public currentTab = 0;

    private dictionary: EosDictionary;
    private selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of selectedNode children
    private _currentList: EosDictionaryNode[];
    private _visibleListNodes: EosDictionaryNode[];
    private paginationConfig: IPaginationConfig;
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _visibleList$: BehaviorSubject<EosDictionaryNode[]>;
    private _viewParameters$: BehaviorSubject<IDictionaryViewParameters>;
    private _paginationConfig$: BehaviorSubject<IPaginationConfig>;
    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;
    private _dictionaries: Map<string, IDictionaryDescriptor>
    private _srchCriteries: any[];
    private _customFields: any;
    private _customTitles: any;
    private _dictMode: number;
    private _dictMode$: BehaviorSubject<number>;

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    /* Observable currentNode for subscribing on updates in components */
    get selectedNode$(): Observable<EosDictionaryNode> {
        return this._selectedNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openedNode$(): Observable<EosDictionaryNode> {
        return this._openedNode$.asObservable();
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

    get dictMode$(): Observable<number> {
        return this._dictMode$.asObservable();
    }

    constructor(
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService,
        private _pipeSrv: PipRX,
        private _router: Router,
    ) {
        this._initViewParameters();
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._currentList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._viewParameters$ = new BehaviorSubject<IDictionaryViewParameters>(this.viewParameters);
        this._paginationConfig$ = new BehaviorSubject<IPaginationConfig>(null);
        this._dictionaries = new Map<string, IDictionaryDescriptor>();
        this._visibleList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._dictMode$ = new BehaviorSubject(0);
        DICTIONARIES
            .sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                } else if (a.title < b.title) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .forEach((dict) => this._dictionaries.set(dict.id, dict));
    }

    private _initViewParameters() {
        // console.log('_initViewParameters');
        this.viewParameters = {
            showAllSubnodes: false,
            showDeleted: false,
            userOrdered: false,
            markItems: false,
            searchResults: false,
            updating: false,
            haveMarked: false
        };
    }
    // May be need used always instead this._viewParameters$.next();
    // Because this.viewParametrs is public and may be changed from other classes need way for share state
    public shareViewParameters() {
        this._viewParameters$.next(this.viewParameters);
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
        return Promise.resolve(DICTIONARIES);
    }

    public defaultOrder() {
        this.dictionary.defaultOrder();
        this._reorderList();
    }

    public closeDictionary() {
        this.dictionary = this.selectedNode = this._openedNode = this._srchCriteries = null;
        this._initViewParameters();
        this._viewParameters$.next(this.viewParameters);
        this._currentList = [];
        this._currentList$.next([]);
        this._visibleList$.next([]);
        this._openedNode$.next(null);
        this._selectedNode$.next(null);
        this._dictionary$.next(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        return this._profileSrv.checkAuth()
            .then((authorized: boolean) => {
                if (authorized) {
                    if (this.dictionary && this.dictionary.id === dictionaryId) {
                        return this.dictionary;
                    } else {
                        // this.viewParameters.showDeleted = false;
                        // this._viewParameters$.next(this.viewParameters);
                        if (this.dictionary) {
                            this.closeDictionary();
                        }
                        return this._openDictionary(dictionaryId);
                    }
                } else {
                    this.closeDictionary();
                    return null;
                }
            });
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p: Promise<EosDictionary> = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            const descriptor = this._dictionaries.get(dictionaryId);
            if (descriptor) {
                this.dictionary = new EosDictionary(descriptor, this._pipeSrv);
                _p = this.dictionary.init()
                    .then((root) => {
                        this._initViewParameters();
                        this._initPaginationConfig();
                        this.viewParameters.userOrdered = this._storageSrv.getUserOrderState(this.dictionary.id);
                        this.viewParameters.markItems = this.dictionary.canMarkItems;
                        this._viewParameters$.next(this.viewParameters);
                        this.dictionary.initUserOrder(
                            this.viewParameters.userOrdered,
                            this._storageSrv.getUserOrder(this.dictionary.id)
                        );
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
                _p = Promise.reject({ message: 'No dictionary' });
            }
        }
        return _p;
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        console.warn('direct getNode');
        return this.openDictionary(dictionaryId)
            .then(() => this._getNode(nodeId));
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
                        const _newNodes = this._updateDictNodes(data, false);
                        return this.dictionary.getNode(nodeId);
                    })
                    .then((node) => {
                        return this.loadChildren(node);
                    })
                    .catch((err) => this._errHandler(err));
            }
        }
    }

    public loadChildren(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (this.dictionary) {
            return this.dictionary.getChildren(node)
                .then((nodes) => {
                    return node;
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }

        // console.log('reloadNode', node);
                // console.log('reloadNode', nodeData);
    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        return this.dictionary.expandNode(nodeId).catch((err) => this._errHandler(err));
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
        this._reorderList();
    }

    private _reorderList() {
        // console.log('_reorderList');
        if (this.dictionary) {
            if (!this.viewParameters.searchResults && this.viewParameters.userOrdered && this.selectedNode) {
                this._currentList = this.dictionary.reorderList(this._currentList, this.selectedNode.id);
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
        this._fixCurrentPage();

        const page = this.paginationConfig;
        const pageList = this._visibleListNodes.slice((page.start - 1) * page.length, page.current * page.length);
        /* unMark invisible nodes */
        this._currentList
            .filter((listNode) => listNode.marked && pageList.findIndex((pageNode) => pageNode.id === listNode.id) === -1)
            .forEach((listNode) => listNode.marked = false);

        if (this._openedNode && pageList.findIndex((node) => node.id === this._openedNode.id) < 0) {
            this._openNode(null);
        }
        this._visibleList$.next(pageList);
    }

    /**
     * @description Mark node selected in tree, updale current list
     * @param nodeId node ID to be selected
     * @returns selected node in current dictionary
     */
    public selectNode(nodeId: string): Promise<EosDictionaryNode> {
        if (nodeId) {
            // console.log('selectNode', nodeId, this.selectedNode);
            if (!this.selectedNode || this.selectedNode.id !== nodeId) {
                // console.log('getting node');
                return this._getNode(nodeId)
                    .then((node) => {
                        if (node) {
                            let parent = node.parent;
                            while (parent) {
                                parent.isExpanded = true;
                                parent = parent.parent;
                            }
                        }
                        this.viewParameters.updating = false;
                        this._viewParameters$.next(this.viewParameters);
                        this._selectNode(node);
                        return node;
                    });
            }
        } else {
            return Promise.resolve(this._selectRoot());
        }
    }

    private _selectNode(node: EosDictionaryNode) {
        if (this.selectedNode !== node) {
            this._srchCriteries = null;
            this.viewParameters.showAllSubnodes = false;
            if (this.selectedNode) {
                if (this.selectedNode.children) {
                    this.selectedNode.children.forEach((child) => child.marked = false);
                }
                this.selectedNode.isActive = false;
            }
            if (node) {
                node.isActive = true;
                this._setCurrentList(node.children);
            }
            this._openNode(null);
            this.selectedNode = node;
            this._selectedNode$.next(node);
            this.viewParameters.searchResults = false;
            this._viewParameters$.next(this.viewParameters);
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

    public openNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this.dictionary) {
            if (!this._openedNode || this._openedNode.id !== nodeId) {
                return this.dictionary.getFullNodeInfo(nodeId)
                    .then((node) => {
                        this._openNode(node);
                        return node;
                    })
                    .catch((err) => this._errHandler(err));
            } else {
                return Promise.resolve(this._openedNode);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    private _openNode(node: EosDictionaryNode) {
        if (this._openedNode !== node) {
            if (this._openedNode) {
                this._openedNode.isSelected = false;
            }
            if (node) {
                node.isSelected = true;
            }
            this._openedNode = node;
            this._openedNode$.next(node);
        }
    }

    public isRoot(nodeId: string): boolean {
        return this.dictionary.root && this.dictionary.root.id === nodeId;
    }

    public updateNode(node: EosDictionaryNode, data: any): Promise<EosDictionaryNode> {
        return this.dictionary.descriptor.updateRecord(node.data, data)
            .then(() => this._reloadList())
            .then(() => {
                return this.dictionary.getNode(node.id);
            })
            .catch((err) => this._errHandler(err));
    }

    public addNode(data: any): Promise<any> {
        if (this.selectedNode) {
            // console.log('addNode', data, this.selectedNode.data);
            return this.dictionary.descriptor.addRecord(data, this.selectedNode.data)
                .then((newNodeId) => {
                    // console.log('created node', newNodeId);
                    return this._reloadList()
                        .then(() => {
                            this._selectedNode$.next(this.selectedNode);
                            return this.dictionary.getNode(newNodeId + '');
                        });
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.reject('No selected node');
        }
    }

    toggleAllSubnodes(): Promise<EosDictionaryNode[]> {
        this.viewParameters.showAllSubnodes = !this.viewParameters.showAllSubnodes;
        this.viewParameters.searchResults = false;
        this._srchCriteries = null;
        return this._reloadList();
    }
    /**
     * @description Marks or unmarks record as deleted
     * @param recursive true if need to delete with children, default false
     * @param deleted true - mark as deleted, false - unmark as deleted
     * @returns Promise<boolean>
     */
    public markDeleted(recursive = false, deleted = true): Promise<boolean> {
        if (this.dictionary) {
            return this.dictionary.markDeleted(recursive, deleted)
                .then(() => this._reloadList())
                .then(() => true)
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
            const keyFld = this.dictionary.descriptor.record.keyField.foreignKey;
            return this.dictionary.deleteMarked()
                .then((results) => {
                    console.log('results', results);
                    let success = true;
                    results.forEach((result) => {
                        if (result.error) {
                            if (result.error.code !== 434) {
                                this._msgSrv.addNewMessage({
                                    type: 'warning',
                                    title: 'Ошибка удаления "' + result.record['CLASSIF_NAME'] + '"',
                                    msg: result.error.message
                                })
                                success = false;
                            } else {
                                throw result.error;
                            }
                        }
                    })
                    return this._reloadList()
                        .then(() => {
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

    private _reloadList(): Promise<any> {
        // console.log('reloading list');
        let pResult = Promise.resolve([]);
        if (this.dictionary) {
            if (this._srchCriteries) {
                pResult = this.dictionary.search(this._srchCriteries);
            } else if (this.viewParameters.showAllSubnodes) {
                pResult = this.dictionary.getAllChildren(this.selectedNode);
            } else {
                this.viewParameters.searchResults = false;
                pResult = this.dictionary.getChildren(this.selectedNode);
            }
        }

        return pResult
            .then((list) => this._setCurrentList(list, true))
            .catch((err) => this._errHandler(err));
    }

    public search(searchString: string, params: ISearchSettings): Promise<EosDictionaryNode[]> {
        this._srchCriteries = this.dictionary.getSearchCriteries(searchString, params, this.selectedNode);
        return this._search();
    }

    public fullSearch(data: any, params: ISearchSettings) {
        this._srchCriteries = [this.dictionary.getFullsearchCriteries(data.rec, params, this.selectedNode)];
        return this._search(params.deleted);
    }


    private _search(showDeleted = false): Promise<EosDictionaryNode[]> {
        // console.log('full search', critery);
        this._openNode(null);
        this.viewParameters.updating = true;
        return this.dictionary.search(this._srchCriteries)
            .then((nodes: any[]) => {
                if (!nodes || nodes.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    this.viewParameters.showDeleted = this.viewParameters.showDeleted || showDeleted;
                }
                this._setCurrentList(nodes);
                this.viewParameters.updating = false;
                this.viewParameters.searchResults = true;
                this._viewParameters$.next(this.viewParameters);
                return this._currentList;
            })
            .catch((err) => this._errHandler(err));
    }

    filter(params: any): Promise<any> {
        return Promise.reject('not implemeted')
    }

    getNodePath(node: EosDictionaryNode): string[] {
        const _path = [
            'spravochniki',
            this.dictionary.id,
        ];

        if (this.dictionary.root !== node) {
            _path.push(node.id);
        }
        return _path;
    }

    getFullNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.openDictionary(dictionaryId)
            .then(() => this.dictionary.getFullNodeInfo(nodeId))
            .catch((err) => this._errHandler(err));
    }

    public orderBy(orderBy: IOrderBy) {
        if (this.dictionary) {
            this.dictionary.orderBy = orderBy;
            this._reorderList();
        }
    }

    public toggleUserOrder(value?: boolean) {
        if (value === undefined) {
            this.viewParameters.userOrdered = !this.viewParameters.userOrdered;
        } else {
            this.viewParameters.userOrdered = value;
        }
        this._viewParameters$.next(this.viewParameters);

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
        console.log('dictionary mode', mode);
        /* todo: implement additional dictionary logic */
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

        if (this.dictionary && this.selectedNode) {
            this.dictionary.setNodeUserOrder(this.selectedNode.id, _order);
            this._reorderList();
            this._storageSrv.setUserOrder(this.dictionary.id, this.selectedNode.id, _order);
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
        this._viewParameters$.next(this.viewParameters);
    }

    private _errHandler(err: RestError | any) {
        if (err instanceof RestError && err.code === 434) {
            this._router.navigate(['login'], {
                queryParams: {
                    returnUrl: this._router.url
                }
            });
            /*
            // login in modal window
            this.modalRef = this._modalSrv.show(LoginFormComponent, {
                keyboard: false,
                backdrop: true,
                ignoreBackdropClick: true
            });
            this.modalRef.content.logged.subscribe((success) => {
                if (success) {
                    this.modalRef.hide();
                }
            });
            */
        } else {
            const errMessage = err.message ? err.message : err;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка обработки. Ответ сервера:',
                msg: errMessage,
                dismissOnTimeout: 30000
            });
            return null;
        }
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
        } else if (this.selectedNode) {
            /* tslint:disable:no-bitwise */
            const _hasMatch = !!~this.selectedNode.children.findIndex((_node) => _node.data.rec[key] === val);
            /* tslint:enable:no-bitwise */
            return _hasMatch ? { 'isUnic': _hasMatch } : null;
        } else {
            return null;
        }
    }

    public markItem(val: boolean) {
        this.viewParameters.haveMarked = val;
        this._viewParameters$.next(this.viewParameters);
    }
}
