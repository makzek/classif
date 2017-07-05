import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosApiService } from './eos-api.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Injectable()
export class EosDictService {
    private _dictionaries: Map<string, EosDictionary>;
    private _dictionariesList: Array<{ id: string, title: string }>;
    private _dictionary: EosDictionary;
    private _selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of _selectedNode children

    private _dictionariesList$: BehaviorSubject<Array<{ id: string, title: string }>>;
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;

    private _listPromise: Promise<any>;
    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;

    constructor(private _api: EosApiService) {
        this._dictionaries = new Map<string, EosDictionary>();
        this._dictionariesList$ = new BehaviorSubject<Array<{ id: string, title: string }>>([]);
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
    }

    /* Observable dictionary for subscribing on updates in components */
    get dictionariesList$(): Observable<Array<{ id: string, title: string }>> {
        return this._dictionariesList$.asObservable();
    }

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

    public getDictionariesList(): Promise<any> {
        return new Promise((res) => {
            if (this._dictionariesList) {
                res(this._dictionariesList);
            } else {
                res(this._api.getDictionaryListMocked()
                    .then((data: any) => {
                        this._dictionariesList = data;
                        this._dictionariesList$.next(data);
                        return data;
                    })
                );
            }
        });
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            _p = new Promise<EosDictionary>((res, rej) => {
                let _dictionary = this._dictionaries.get(dictionaryId);

                if (_dictionary) {
                    this._mDictionaryPromise.delete(dictionaryId);
                    res(_dictionary);
                } else {
                    this._api.getDictionaryMocked(dictionaryId)
                        .then((data: any) => {
                            _dictionary = new EosDictionary(data);
                            this._dictionary = _dictionary;
                            return this._api.getDictionaryNodesMocked(dictionaryId);
                        })
                        .then((data) => {
                            this._dictionary.init(data);
                            this._dictionaries.set(dictionaryId, _dictionary);
                            this._dictionary$.next(_dictionary);
                            this._mDictionaryPromise.delete(dictionaryId);
                            res(_dictionary);
                        })
                        .catch((err) => {
                            this._mDictionaryPromise.delete(dictionaryId);
                            rej(err);
                        });
                }
            });
            this._mDictionaryPromise.set(dictionaryId, _p);
        }
        return _p;
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return new Promise<EosDictionaryNode>((res, rej) => {
            this.openDictionary(dictionaryId)
                .then((_dict) => {
                    let _node = _dict.getNode(nodeId);
                    if (_node) {
                        res(_node);
                    } else {
                        this._api.getNodeMocked(dictionaryId, nodeId)
                            .then((data: any) => {
                                _node = new EosDictionaryNode(data);
                                _dict.addNode(_node, _node.parent.id);
                                res(_node);
                            })
                            .catch((err) => rej(err));
                    }
                })
                .catch((err) => rej(err));
        });
    }

    public selectNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return new Promise((res, rej) => {
            this.getNode(dictionaryId, nodeId)
                .then((node) => {
                    if (this._selectedNode !== node) {
                        // expand all parents of selected node
                        let parent = node.parent;
                        while (parent) {
                            parent.isExpanded = true;
                            parent = parent.parent;
                        }
                        this._selectedNode = node;
                        this._selectedNode$.next(node);
                        this._openedNode = null;
                        this._openedNode$.next(null);
                    }
                    res(node);
                })
                .catch((err) => rej(err));
        });
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

    public getChildren(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode[]> {
        return new Promise((res, rej) => { // tslint:disable-line:no-unused-variable
            this.getNode(dictionaryId, nodeId)
                .then((_node) => {
                    rej('not implemented (may be useless???)');
                })
                .catch((err) => rej(err));
        });
    }

    public updateNode(dictionaryId: string, nodeId: string, value: EosDictionaryNode): Promise<any> { // tslint:disable-line:no-unused-variable max-line-length
        return new Promise((res, rej) => { // tslint:disable-line:no-unused-variable
            this.getNode(dictionaryId, nodeId)
            .then((node) => {
                Object.assign(node, value);
                // this._selectedNode$.next(this._selectedNode);
                res(node);
            }).catch(
                (err) => rej(err)
            );
            // rej('not implemented');
        });
    }
}
