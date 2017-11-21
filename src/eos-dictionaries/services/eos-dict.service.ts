import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictApiService } from './eos-api.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters } from '../core/eos-dictionary.interfaces';
import { ISearchSettings } from '../core/search-settings.interface';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { WARN_SEARCH_NOTFOUND, DANGER_LOGICALY_RESTORE_ELEMENT } from '../consts/messages.consts';
import { LS_USE_USER_ORDER } from '../consts/common';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { IOrderBy } from '../core/sort.interface'
import { EosStorageService } from '../../app/services/eos-storage.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SUBNODES_RESTORE } from '../../app/consts/confirms.const';

@Injectable()
export class EosDictService {
    private _dictionariesList = DICTIONARIES;
    private dictionary: EosDictionary;
    private selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of selectedNode children
    private _currentList: EosDictionaryNode[];
    private _viewParameters: IDictionaryViewParameters;

    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _viewParameters$: BehaviorSubject<IDictionaryViewParameters>;

    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;

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

    get userOrdered(): boolean {
        return this.dictionary && this.dictionary.userOrdered;
    }

    constructor(
        private _api: EosDictApiService,
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this._initViewParameters();
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._currentList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._viewParameters$ = new BehaviorSubject<IDictionaryViewParameters>(this._viewParameters);
    }

    private _initViewParameters() {
        this._viewParameters = {
            showDeleted: false,
            userOrdered: false,
            markItems: false,
            searchResults: false
        };
    }

    public getDictionariesList(): Promise<any> {
        return Promise.resolve(DICTIONARIES);
    }

    closeDictionary() {
        this.dictionary = this.selectedNode = this._openedNode = null;
        this._initViewParameters();
        this._currentList = [];
        this._currentList$.next([]);
        this._viewParameters$.next(this._viewParameters);
        this._openedNode$.next(null);
        this._selectedNode$.next(null);
        this._dictionary$.next(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        return this._profileSrv.checkAuth()
            .then((authorized) => {
                if (authorized) {
                    if (this.dictionary && this.dictionary.id === dictionaryId) {
                        return this.dictionary;
                    } else {
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
            this.dictionary = null;
            _p = this._api.getDictionaryDescriptorData(dictionaryId)
                .then((descData: any) => {
                    this.dictionary = new EosDictionary(descData);
                    this._api.init(this.dictionary.descriptor);
                    return this._api.getRoot();
                })
                .then((data: any[]) => {
                    this._initViewParameters();
                    this._viewParameters.userOrdered = this._storageSrv.getItem(LS_USE_USER_ORDER);
                    this._viewParameters.markItems = this.dictionary.canMarkItems;
                    this._viewParameters$.next(this._viewParameters);
                    this.dictionary.initUserOrder(
                        this._viewParameters.userOrdered,
                        this._storageSrv.getUserOrder(this.dictionary.id)
                    );
                    if (data && data.length) {
                        this.dictionary.init(data);
                    }
                    /*
                    if (this.dictionary.userOrdered) {
                        this.dictionary.reorder();
                    }
                    */
                    this._mDictionaryPromise.delete(dictionaryId);
                    this._dictionary$.next(this.dictionary);
                    return this.dictionary;
                })
                .catch((err: Response) => {
                    this.closeDictionary();
                    this._mDictionaryPromise.delete(dictionaryId);
                    return null;
                });
            this._mDictionaryPromise.set(dictionaryId, _p);
        }
        return _p;
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.openDictionary(dictionaryId)
            .then(() => this._getNode(nodeId));
    }

    private _getNode(nodeId: string): Promise<EosDictionaryNode> {
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
                return this._api.getNode(nodeId)
                    .then((data) => {
                        this._updateDictNodes(data, false);
                        return this.dictionary.getNode(nodeId);
                    })
                    .then((node) => {
                        return this.loadChildren(node);
                    })
            }
        }
    }

    public loadChildren(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        // console.log('loadChildren for', node.id);
        node.updating = true;
        return this._api.getChildren(node)
            .then((data: any[]) => {
                this._updateDictNodes(data, true);
                node.updating = false;
                return this.dictionary.getNode(node.id);
            });

    }

    public reloadNode(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        node.updating = true;
        return this._api.getNode(node.originalId)
            .then((nodeData) => {
                node.updateData(nodeData);
                node.updating = false;
                return node;
            })
    }

    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        return this.getNode(this.dictionary.id, nodeId);
    }

    private _updateDictNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        if (data && data.length) {
            return this.dictionary.updateNodes(data, updateTree);
        } else {
            return null;
        }
    }

    private _setCurrentList(nodes: EosDictionaryNode[]) {
        this._currentList = nodes || [];
        // todo: filter & order list before anounce
        this._updateCurrentList();
    }

    private _updateCurrentList() {
        let nodes = this._currentList;

        if (!this._viewParameters.showDeleted) {
            nodes = nodes.filter((node) => node.isVisible(this._viewParameters.showDeleted));
        }

        this._currentList$.next(nodes);
    }

    /**
     *
     * @param nodeId node ID to be selected
     * @returns selected node in current dictionary
     */
    public selectNode(nodeId: string): Promise<EosDictionaryNode> {
        if (nodeId) {
            return this._getNode(nodeId)
                .then((node) => {
                    if (node) {
                        let parent = node.parent;
                        while (parent) {
                            parent.isExpanded = true;
                            parent = parent.parent;
                        }
                    }
                    this._selectNode(node);
                    return node;
                });
        } else {
            return Promise.resolve(this._selectRoot());
        }
    }

    private _selectNode(node: EosDictionaryNode) {
        if (this.selectedNode !== node) {
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
            return this._getNode(nodeId)
                .then((node) => {
                    this._openNode(node);
                    return node;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    private _openNode(node: EosDictionaryNode) {
        if (this._openedNode !== node) {
            if (node) {
                node.isSelected = true;
            }
            if (this._openedNode) {
                this._openedNode.isSelected = false;
            }
            this._openedNode = node;
            this._openedNode$.next(node);
        }
    }

    public isRoot(nodeId: string): boolean {
        return this.dictionary.root && this.dictionary.root.id === nodeId;
    }

    public updateNode(node: EosDictionaryNode, data: any): Promise<EosDictionaryNode> {
        return this._api.update(node.data, data)
            .then(() => {
                return this.reloadNode(node);
            });
    }

    public addNode(data: any): Promise<any> {
        if (this.selectedNode) {
            return this._api.addNode(this.selectedNode.data, data)
                .then((newNodeId) => {
                    console.log('created node', newNodeId);
                    return this.loadChildren(this.selectedNode)
                        .then(() => {
                            this._selectedNode$.next(this.selectedNode);
                            return this.dictionary.getNode(newNodeId + '');
                        });
                });
        } else {
            return Promise.reject('No selected node');
        }
    }

    private _deleteNode(node: EosDictionaryNode): void {
        if (this._openedNode === node) {
            this._openNode(null);
        }
        // Object.assign(node, { ...node, isDeleted: true });
        this.updateNode(node, { DELETED: 1 }).then((res) => {
            this.reloadNode(node);
        });
        if (node.children) {
            node.children.forEach((subNode) => this._deleteNode(subNode));
        }
    }

    public deleteMarkedNodes(dictionaryId: string, nodes: string[]): Promise<any> {
        nodes.forEach((nodeId) => {
            this.getNode(dictionaryId, nodeId)
                .then((node) => this._deleteNode(node));
        });
        // this._dictionary$.next(this.dictionary);
        this._selectedNode$.next(this.selectedNode);
        return Promise.resolve(true); /* fake */
    }

    public physicallyDelete(nodeId: string): Promise<any> {
        const _node = this.dictionary.getNode(nodeId);
        return this._api.deleteNode(_node.data)
            .then(() => {
                this.dictionary.deleteNode(nodeId, true);
                this._selectedNode$.next(this.selectedNode);
            });
    }

    public search(searchString: string, params: ISearchSettings): Promise<EosDictionaryNode[]> {
        const _criteries = this.dictionary.getSearchCriteries(searchString, params, this.selectedNode);
        return this._search(_criteries);
    }

    public fullSearch(data: any, params: ISearchSettings) {
        const critery = this.dictionary.getFullsearchCriteries(data, params, this.selectedNode);
        return this._search([critery]);
    }


    private _search(criteries: any[]): Promise<EosDictionaryNode[]> {
        // console.log('full search', critery);
        this._openNode(null);
        return this._api.search(criteries)
            .then((data: any[]) => {
                let nodes = [];
                if (!data || data.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    nodes = this.dictionary.updateNodes(data, false);
                }
                this._setCurrentList(nodes);
                this._viewParameters.searchResults = true;
                this._viewParameters$.next(this._viewParameters);
                return this._currentList;
            });
    }

    public restoreItem(node: EosDictionaryNode) {
        if (node.parent && node.parent.isDeleted) {
            this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
        }
        // Object.assign(node, { ...node, isDeleted: false });
        this.updateNode(node, { DELETED: 0 })
            .then((res) => {
                return this.reloadNode(node);
            });

        // WTF?????
        Object.assign(node, { ...node, marked: false });
        if (node.children) {
            let delChld: boolean;
            const _confrm = Object.assign({}, CONFIRM_SUBNODES_RESTORE);
            _confrm.body = _confrm.body.replace('{{name}}', node.data['CLASSIF_NAME']);

            this._confirmSrv
                .confirm(_confrm)
                .then((confirmed: boolean) => {
                    delChld = confirmed;
                    if (delChld) {
                        node.children.forEach((subNode) => {
                            this._restoreItem(subNode);
                        });
                    }
                }).catch();
        }
    }

    private _restoreItem(node: EosDictionaryNode) {
        if (node.parent && node.parent.isDeleted) {
            this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
        }
        this.updateNode(node, { DELETED: 0 }).then((res) => {
            this.reloadNode(node);
        });
        Object.assign(node, { ...node, marked: false });
        if (node.children) {
            node.children.forEach((subNode) => {
                this._restoreItem(subNode);
            });
        }
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

    public orderBy(orderBy: IOrderBy) {
        if (this.dictionary) {
            this.dictionary.orderBy = orderBy;
            this._reorder();
        }
    }

    public toggleUserOrder() {
        this._viewParameters.userOrdered = !this._viewParameters.userOrdered;
        if (this.dictionary) {
            this.dictionary.userOrdered = this._viewParameters.userOrdered;
            this._storageSrv.setItem(LS_USE_USER_ORDER, this.dictionary.userOrdered, true);
            this._reorder();
        }
    }

    // temporary
    private _reorder() {
        if (this.dictionary) {
            if (this._viewParameters.searchResults) {
                this._setCurrentList(this.dictionary.reorderList(this._currentList));
            } else {
                this._setCurrentList(this.dictionary.reorderList(this._currentList, this.selectedNode.id));
            }
        }
    }

    private aToKeys(a: EosDictionaryNode[]): string[] {
        return a.map((node) => node.id);
    }

    setUserOrder(ordered: EosDictionaryNode[], fullList: EosDictionaryNode[]) {
        const _original = [];
        const _move = {};

        console.log('setUserOrder', this.aToKeys(ordered), this.aToKeys(fullList));
        // restore original order
        fullList.forEach((node) => {
            const _oNode = ordered.find((item) => item.id === node.id);
            if (_oNode) {
                _original.push(node);
            }
        });

        _original.forEach((node, idx) => {
            _move[node.id] = ordered[idx];
        });

        const _order = fullList.map((node) => {
            if (_move[node.id]) {
                return _move[node.id].id;
            } else {
                return node.id;
            }
        });

        if (this.dictionary && this.selectedNode) {
            this.dictionary.setNodeUserOrder(this.selectedNode.id, _order);
            this._reorder();
            this._storageSrv.setUserOrder(this.dictionary.id, this.selectedNode.id, _order);
        }
    }

    toggleDeleted() {
        this._viewParameters.showDeleted = !this._viewParameters.showDeleted;
        if (!this._viewParameters.showDeleted) {
            this._currentList.forEach((node) => {
                if (node.isDeleted) { node.marked = false; }
            });
        }
        this._updateCurrentList();
        this._viewParameters$.next(this._viewParameters);
    }

    private _errHandler(err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage,
            dismissOnTimeout: 100000
        });
        return null;
    }
}
