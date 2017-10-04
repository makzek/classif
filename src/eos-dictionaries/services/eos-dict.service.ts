import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictApiService } from './eos-api.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';

import { DICTIONARIES } from '../consts/dictionaries.consts';

import { WARN_SEARCH_NOTFOUND, DANGER_LOGICALY_RESTORE_ELEMENT } from '../consts/messages.consts';

import { RecordDescriptor } from '../core/record-descriptor';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

import { EosUserProfileService } from '../../app/services/eos-user-profile.service';

@Injectable()
export class EosDictService {
    /* private _dictionaries: Map<string, EosDictionary>; */
    private _dictionariesList = DICTIONARIES;
    private _dictionary: EosDictionary;
    private _selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of _selectedNode children
    private _searchResults: EosDictionaryNode[];
    private _searchString: string;

    /* private _dictionariesList$: BehaviorSubject<Array<{ id: string, title: string }>>; */
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _searchResults$: BehaviorSubject<EosDictionaryNode[]>;

    private _listPromise: Promise<any>;
    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;

    constructor(
        private _api: EosDictApiService,
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService
    ) {
        /* this._dictionaries = new Map<string, EosDictionary>(); */
        /* this._dictionariesList$ = new BehaviorSubject<Array<{ id: string, title: string }>>([]); */
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._searchResults$ = new BehaviorSubject<EosDictionaryNode[]>([]);
    }

    /* Observable dictionary for subscribing on updates in components */
    /*
    get dictionariesList$(): Observable<Array<{ id: string, title: string }>> {
        return this._dictionariesList$.asObservable();
    }
    */

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

    get searchResults$(): Observable<EosDictionaryNode[]> {
        return this._searchResults$.asObservable();
    }

    public getDictionariesList(): Promise<any> {
        return new Promise((res) => {
            res(DICTIONARIES);
        });
    }

    closeDictionary() {
        this._dictionary = this._selectedNode = this._openedNode = null;
        this._openedNode$.next(null);
        this._selectedNode$.next(null);
        this._dictionary$.next(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        return this._profileSrv.checkAuth()
            .then((authorized) => {
                if (authorized) {
                    if (this._dictionary && this._dictionary.id === dictionaryId) {
                        return this._dictionary;
                    } else {
                        return this._openDictionary(dictionaryId);
                    }
                } else {
                    this.closeDictionary();
                    return null;
                }
            });
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            let _dictionary = null;
            _p = <Promise<EosDictionary>>this._api.getDictionaryDescriptorData(dictionaryId)
                .then((descData: any) => {
                    _dictionary = new EosDictionary(descData);
                    this._api.init(_dictionary.descriptor);
                    return this._api.getRoot();
                })
                .then((data: any[]) => {
                    if (data && data.length && _dictionary) {
                        _dictionary.init(data);
                        this._dictionary = _dictionary;
                        this._dictionary$.next(this._dictionary);
                    } else {
                        this.closeDictionary();
                    }
                    this._mDictionaryPromise.delete(dictionaryId);
                    return this._dictionary;
                })
                .catch((err: Response) => {
                    this.closeDictionary();
                    this._mDictionaryPromise.delete(dictionaryId);
                    Promise.reject(err);
                });
            this._mDictionaryPromise.set(dictionaryId, _p);
        }
        return _p;
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return <Promise<EosDictionaryNode>>this.openDictionary(dictionaryId)
            .then((_dict) => {
                if (_dict) {
                    const _node = _dict.getNode(nodeId);
                    if (_node) {
                        if (_node.loaded) {
                            return _node;
                        } else {
                            return this.loadChildren(_node);
                        }
                    } else {
                        return this._api.getNodeWithChildren(nodeId) // temp solution
                            .then((data: any[]) => {
                                this._updateDictNodes(_dict, data);
                                return _dict.getNode(nodeId);
                            });
                    }
                }
            });
    }

    public loadChildren(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        node.updating = true;
        return this._api.getChildren(node.data['ISN_NODE'])
            .then((data: any[]) => {
                this._updateDictNodes(this._dictionary, data);
                node.updating = false;
                return this._dictionary.getNode(node.id);
            });

    }

    public reloadNode(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        node.updating = true;
        return this._api.getNode(node.id)
            .then((nodeData) => {
                node.updateData(nodeData);
                node.updating = false;
                return node;
            })
    }

    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        return this.getNode(this._dictionary.id, nodeId);
    }

    private _updateDictNodes(dict: EosDictionary, data: any[]) {
        if (data && data.length) {
            dict.updateNodes(data);
        }
    }

    public selectNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return new Promise((res, rej) => {
            if (!nodeId) {
                this._selectedNode = this._dictionary.root;
                this._selectedNode$.next(this._selectedNode);
                this._openedNode = this._dictionary.root;
                this._openedNode$.next(this._openedNode);
                res(null);
            }
            return this.getNode(dictionaryId, nodeId)
                .then((node) => {
                    if (this._selectedNode !== node) {
                        if (node) {
                            // expand all parents of selected node
                            let parent = node.parent;
                            while (parent) {
                                parent.isExpanded = true;
                                parent = parent.parent;
                            }
                        }
                        /* console.log('selectNode', node); */
                        this._selectedNode = node;
                        this._selectedNode$.next(node);
                        this._openedNode = null;
                        this._openedNode$.next(null);
                    }
                    return node;
                });
        });
    }

    public isRoot(nodeId: string): boolean {
        return this._dictionary.root.id === nodeId;
    }

    public openNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return new Promise((res, rej) => {
            this.getNode(dictionaryId, nodeId)
                .then((node) => {
                    if (this._openedNode !== node) {
                        this._openedNode = node;
                        this._openedNode$.next(node);
                    }
                    res(node);
                })
                .catch((err) => rej(err));
        });
    }

    public updateNode(node: EosDictionaryNode, data: any[]): Promise<any> {
        return this._api.update(node.data, data);
    }

    public addNode(data: any): Promise<any> {
        if (this._selectedNode) {
            return this._api.addNode(this._selectedNode.data, data)
                .then((newNodeId) => {
                    return this.loadChildren(this._selectedNode)
                        .then(() => {
                            this._selectedNode$.next(this._selectedNode);
                            return this._dictionary.getNode(newNodeId);
                        });
                });
        } else {
            return Promise.reject('No selected node');
        }
    }

    private _deleteNode(node: EosDictionaryNode): void {
        if (this._openedNode === node) {
            this._openedNode = null;
            this._openedNode$.next(this._openedNode);
        }
        Object.assign(node, { ...node, isDeleted: true });
        if (node.children) {
            node.children.forEach((subNode) => this._deleteNode(subNode));
        }
    }

    public deleteSelectedNodes(dictionaryId: string, nodes: string[]): void {
        nodes.forEach((nodeId) => {
            this.getNode(dictionaryId, nodeId)
                .then((node) => this._deleteNode(node));
        });
        this._dictionary$.next(this._dictionary);
        /* fake */
    }

    public physicallyDelete(nodeId: string): boolean {
        const _result = this._dictionary.deleteNode(nodeId, true);
        this._dictionary$.next(this._dictionary);
        this._selectedNode$.next(this._selectedNode);
        return _result;
    }

    public search(searchString: string, globalSearch: boolean) {
        this._searchString = searchString;
        if (searchString.length) {
            this._searchResults = this._dictionary.search(searchString, globalSearch, this._selectedNode);
            if (!this._searchResults.length) {
                this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
            }
        } else {
            this._searchResults = [];
        }
        this._searchResults$.next(this._searchResults);
    }

    public fullSearch(queries: IFieldView[], searchInDeleted: boolean) {
        this._searchResults = this._dictionary.fullSearch(queries, searchInDeleted);
        if (!this._searchResults.length) {
            this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
        }
        this._searchResults$.next(this._searchResults);
    }

    public restoreItem(node: EosDictionaryNode) {
        if (node.parent && node.parent.isDeleted) {
            this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
        }
        Object.assign(node, { ...node, isDeleted: false });
        Object.assign(node, { ...node, selected: false });
        if (node.children) {
            node.children.forEach((subNode) => this.restoreItem(subNode));
        }
    }
}
