import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosApiService } from './eos-api.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Injectable()
export class EosDictService {
    private _dictionaries: Map<string, EosDictionary>;
    private _dictionariesList: Array<{id: string, title: string}>;

    private _selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of _selectedNode children
    private _dictionary: EosDictionary;

    private _dictionariesList$: BehaviorSubject<Array<{id: string, title: string}>>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _dictionary$: BehaviorSubject<EosDictionary>;

    constructor(private _api: EosApiService) {
        this._dictionaries = new Map<string, EosDictionary>();
        this._dictionariesList$ = new BehaviorSubject<Array<{id: string, title: string}>>([]);
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        // this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        // this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
    }

    /* Observable dictionary for subscribing on updates in components */
    get dictionariesList$(): Observable<Array<{id: string, title: string}>> {
        return this._dictionariesList$.asObservable();
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

    /* Observable dictionary for subscribing on updates in components */
    loadChildrenNodes(parentId: number) {
        console.log('EosDictService loadChildrenNodes', parentId);
        const parentNode = this._dictionary.getNode(parentId);
        // if it is parent node and children haven't been loaded yet, do it
        if (parentNode.isNode && !parentNode.children) {
            this._loadNodeChildren(parentId);
        }
    }

    private _checkDictionary(id: string): void {
        if (!this._dictionaries.get(id)) {
            this._loadDictionary(id);
        }
    }

    private _changeParameters(
        dictionaryId: string,
        selectedNode: (EosDictionaryNode | null) = null,
        openedNode: (EosDictionaryNode | null) = null
    ): void {
        this._checkDictionary(dictionaryId);
        this._dictionary = this._dictionaries.get(dictionaryId);
        this._openedNode = openedNode;
        this._selectedNode = selectedNode;
        this._dictionary$.next(this._dictionary);
        this._selectedNode$.next(this._selectedNode);
        this._openedNode$.next(this._openedNode);
    }

    getDictionariesList(): void {
        if (!this._dictionariesList) { this._loadDictionariesList(); }
        this._dictionariesList$.next(this._dictionariesList);
    }

    openDictionary(id: string): void {
        this._changeParameters(id);
    }

    openNode(dictionaryId: string, nodeId: number): void {
        this._changeParameters(dictionaryId, this._dictionary.getNode(nodeId));
    }

    selectNode(dictionaryId: string, nodeId: number): void {
        const selectedNode = this._dictionary.getNode(nodeId);
        this._changeParameters(dictionaryId, selectedNode.parent, selectedNode);
    }

    // openNode(dictionaryName: string, nodeId: number): void {
    //     this._checkDictionary(dictionaryName);
    //     this._changeParameters(dictionaryName, this._dictionary.getNode(nodeId));
    // }
    //
    // selectNode(dictionaryName: string, nodeId: number): void {
    //     this._checkDictionary(dictionaryName);
    //     const selectedNode = this._dictionary.getNode(nodeId);
    //     this._changeParameters(dictionaryName, selectedNode.parent, selectedNode);
    // }
    //
    // deleteNode(dictionary: string, id: number, hard = false) {
    //
    // }

    getNode(dictionaryName: string, nodeId: number): Promise<EosDictionaryNode> {
        const example: EosDictionaryNode = {
            id: nodeId,
            code: 'code',
            title: dictionaryName,
            description: 'description',
            isDeleted: false,
            isNode: false,
            selected: false,
            data: {
                code: '102',
                shortName: 'lalala',
                fullName: 'lalala lalala lalala',
                note: '',
                indexSEV: 'asd123',
            },
        };
        return Promise.resolve(example);
    }

    setNode(node: EosDictionaryNode): void {
    }

    /* load dictionary data with API */
    private _loadDictionariesList() {
        this._dictionariesList = [
            {id: 'rubricator', title: 'Рубрикатор'},
            {id: 'documents', title: 'Группы документов'},
            {id: 'regions', title: 'Регионы'},
            {id: 'units', title: 'Подраздиления'},
            {id: 'delivery', title: 'Виды доставки'},
            {id: 'reestrs', title: 'Типы реестров'},
            {id: 'visas', title: 'Типы виз'},
        ];
    }

    /* load dictionary data with API */
    private _loadDictionary(id: string) {
        // TODO: make async
        const nodes = this._api.getDictionaryNodeChildren(id);
        const eosNodes: EosDictionaryNode[] = nodes.map(({ parentId, ...rest }) => ({ ...rest, parent: null }));
        const dictionary = new EosDictionary(id);
        // TODO: change title
        dictionary.init('Рубрикатор', eosNodes);
        this._dictionaries.set(id, dictionary);
     }

    // /* load dictionary node data with API */
    // private _loadNode(id: number) {
    //
    // }

    /* load dictionary node children data with API */
    private _loadNodeChildren(parentId: number) {
        // TODO: get api data by dictionary name
        // TODO: make async
        const children = this._api.getDictionaryNodeChildren(this._dictionary.id, parentId);
        this._dictionary.setChildren(parentId, children);
        this._dictionary$.next(this._dictionary);
    }
}
