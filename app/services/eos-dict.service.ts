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

    private _openedNode: EosDictionaryNode; // selected in tree
    private _selectedNode: EosDictionaryNode; // selected in list of _openedNode children
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

    private _checkDictionary(dictionaryId: string): void {
        if (!this._dictionaries.get(dictionaryId)) {
            this._loadDictionary(dictionaryId);
        }
    }

    private _changeParameters(
        dictionaryId: string,
        openedNode: (EosDictionaryNode | null) = null,
        selectedNode: (EosDictionaryNode | null) = null,
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
        if (!this._dictionariesList) {this._loadDictionariesList();}
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

    deleteNode(dictionary: string, id: number, hard = false) {

    }

    getNode(dictionaryName: string, nodeId: number): Promise<EosDictionaryNode> {
        let example: EosDictionaryNode = {
            id: nodeId,
            code: 'code',
            title: dictionaryName,
            description: 'description',
            isDeleted: false,
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
        if (id === 'rubricator') {
            const dictionary = new EosDictionary(id);
            dictionary.init(
                'Рубрикатор',
                [{
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
                }] as EosDictionaryNode[],
            );
            this._dictionaries.set(id, dictionary);
        }
    }

    /* load dictionary node data with API */
    private _loadNode(id: number) {

    }
}
