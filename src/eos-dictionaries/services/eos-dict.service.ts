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
    public dictionary: EosDictionary;
    private selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of selectedNode children
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
        this.dictionary = this.selectedNode = this._openedNode = null;
        this._openedNode$.next(null);
        this._selectedNode$.next(null);
        this._dictionary$.next(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        return this._profileSrv.checkAuth()
            .then((authorized) => {
                if (authorized) {
                    if (this.dictionary && this.dictionary.id === dictionaryId) {
                        //                        this._selectRoot();
                        return this.dictionary;
                    } else {
                        this.closeDictionary();
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
                        this.dictionary = _dictionary;
                        this._dictionary$.next(this.dictionary);
                        this._selectRoot();
                    } else {
                        this.closeDictionary();
                    }
                    this._mDictionaryPromise.delete(dictionaryId);
                    return this.dictionary;
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

    private _selectRoot() {
        if (this.dictionary.root) {
            this._selectNode(this.dictionary.root)
        } else {
            this._selectNode(null);
        }
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
                this._updateDictNodes(this.dictionary, data);
                node.updating = false;
                return this.dictionary.getNode(node.id);
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
        return this.getNode(this.dictionary.id, nodeId);
    }

    private _updateDictNodes(dict: EosDictionary, data: any[]) {
        if (data && data.length) {
            dict.updateNodes(data);
        }
    }

    public selectNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return new Promise((res, rej) => {
            if (!nodeId) {
                this._selectNode(this.dictionary.root);
                this._openNode(this.dictionary.root);
                return res(this.dictionary.root);
            } else {
                return this.getNode(dictionaryId, nodeId)
                    .then((node) => {
                        if (this.selectedNode !== node) {
                            if (node) {
                                // expand all parents of selected node
                                let parent = node.parent;
                                while (parent) {
                                    parent.isExpanded = true;
                                    parent = parent.parent;
                                }
                            }
                            /* console.log('selectNode', node); */
                            this._selectNode(node);
                            /* this._openNode(null); */
                        }
                        return this.selectedNode;
                    });
            }
        });
    }

    private _selectNode(node: EosDictionaryNode) {
        if (this.selectedNode !== node) {
            if (this.selectedNode) {
                this.selectedNode.isActive = false;
            }
            if (node) {
                node.isActive = true;
            }
            this.selectedNode = node;
            this._selectedNode$.next(node);
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
        return this.dictionary.root.id === nodeId;
    }

    public openNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this.dictionary) {
        return this.getNode(this.dictionary.id, nodeId)
            .then((node) => {
                this._openNode(node);
                return node;
            });
        } else {
            return Promise.resolve(null);
        }

    }

    public updateNode(node: EosDictionaryNode, data: any[]): Promise<any> {
        return this._api.update(node.data, data);
    }

    public addNode(data: any): Promise<any> {
        if (this.selectedNode) {
            return this._api.addNode(this.selectedNode.data, data)
                .then((newNodeId) => {
                    return this.loadChildren(this.selectedNode)
                        .then(() => {
                            this._selectedNode$.next(this.selectedNode);
                            return this.dictionary.getNode(newNodeId);
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
        Object.assign(node, { ...node, isDeleted: true });
        if (node.children) {
            node.children.forEach((subNode) => this._deleteNode(subNode));
        }
    }

    public deleteSelectedNodes(dictionaryId: string, nodes: string[]): Promise<any> {
        nodes.forEach((nodeId) => {
            this.getNode(dictionaryId, nodeId)
                .then((node) => this._deleteNode(node));
        });
        this._dictionary$.next(this.dictionary);
        this._selectedNode$.next(this.selectedNode);
        return Promise.resolve(true); /* fake */
    }

    public physicallyDelete(nodeId: string): boolean {
        const _result = this.dictionary.deleteNode(nodeId, true);
        this._dictionary$.next(this.dictionary);
        this._selectedNode$.next(this.selectedNode);
        return _result;
    }

    public search(searchString: string, globalSearch: boolean) {
        this._searchString = searchString;
        if (searchString.length) {
            this._searchResults = this.dictionary.search(searchString, globalSearch, this.selectedNode);
            if (!this._searchResults.length) {
                this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
            }
        } else {
            this._searchResults = [];
        }
        this._searchResults$.next(this._searchResults);
    }

    public fullSearch(queries: IFieldView[], searchInDeleted: boolean) {
        this._searchResults = this.dictionary.fullSearch(queries, searchInDeleted);
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
        Object.assign(node, { ...node, marked: false });
        if (node.children) {
            node.children.forEach((subNode) => this.restoreItem(subNode));
        }
    }

    getNodePath(node: EosDictionaryNode): string[] {
        return [
            'spravochniki',
            this.dictionary.id,
            node.id + '',
        ];
    }
}
