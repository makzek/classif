import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosApiService } from './eos-api.service';
import { EosDictionary } from '../dictionary/eos-dictionary';
import { EosDictionaryNode } from '../dictionary/eos-dictionary-node';

@Injectable()
export class EosDictService {
    private _dictionaries: Map<string, EosDictionary>;

    private _openedNode: EosDictionaryNode; // selected in tree
    private _selectedNode: EosDictionaryNode; // selected in list of _openedNode children
    private _dictionary: EosDictionary;

    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _dictionary$: BehaviorSubject<EosDictionary>;

    constructor(private _api: EosApiService) {
        this._dictionaries = new Map<string, EosDictionary>();
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
    }

    /* Observable currentNode for subscribing on updates in components */
    get currentNode$(): Observable<EosDictionaryNode> {
        return this._selectedNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openNode$(): Observable<EosDictionaryNode> {
        return this._openedNode$.asObservable();
    }

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    private _checkDictionary(dictionaryName: string): void {
        if (!this._dictionaries.get(name)) {
            this._loadDictionary(name);
        }
    }

    private _changeParameters(
        dictionaryName: string,
        openedNode: (EosDictionaryNode | null) = null,
        selectedNode: (EosDictionaryNode | null) = null,
    ): void {
        this._dictionary = this._dictionaries.get(dictionaryName);
        this._openedNode = openedNode;
        this._selectedNode = selectedNode;
        this._dictionary$.next(this._dictionary);
        this._selectedNode$.next(this._selectedNode);
        this._openedNode$.next(this._openedNode);
    }

    openDictionary(name: string): void {
        this._checkDictionary(name);
        this._changeParameters(name);
    }

    openNode(dictionaryName: string, nodeId: number): void {
        this._checkDictionary(dictionaryName);
        this._changeParameters(dictionaryName, this._dictionary.getNode(nodeId));
    }

    selectNode(dictionaryName: string, nodeId: number): void {
        this._checkDictionary(dictionaryName);
        const selectedNode = this._dictionary.getNode(nodeId);
        this._changeParameters(dictionaryName, selectedNode.parent, selectedNode);
    }

    deleteNode(dictionary: string, id: number, hard = false) {

    }

    getNode(dictionaryName: string, nodeId: number): any /*Observable<any>*/ {

    }

    /* load dictionary data with API */
    private _loadDictionary(name: string) {
        if (name === 'rubricator') {
            const dictionary = new EosDictionary();
            dictionary.init([{
                id: 1,
                title: 'title of the first node',
                code: '1',
                description: 'description of the first node',
                isDeleted: false,
            }, {
                id: 2,
                title: 'title of the second node',
                code: '2',
                description: 'description of the second node',
                isDeleted: true,
            }, {
                id: 3,
                title: 'title of the trird node',
                code: '3',
                description: 'description of the trird node',
                isDeleted: false,
            }] as EosDictionaryNode[]);
            console.log('_loadDictionary', name, dictionary);
            this._dictionaries.set(name, dictionary);
        }
     }

    /* load dictionary node data with API */
    private _loadNode(id: number) {

    }
}
