import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosApiService } from './eos-api.service';
import { EosDictionary } from '../dictionary/eos-dictionary';
import { EosDictionaryNode } from '../dictionary/eos-dictionary-node';

@Injectable()
export class EosDictService {
    private _dicts: Map<string, EosDictionary>;

    private _currentNode: EosDictionaryNode;
    private _openNode: EosDictionaryNode;
    private _dictionary: EosDictionary;

    private _currentNode$: BehaviorSubject<EosDictionaryNode>;
    private _openNode$: BehaviorSubject<EosDictionaryNode>;
    private _dictionary$: BehaviorSubject<EosDictionary>;

    constructor(private _api: EosApiService) {
        this._dicts = new Map<string, EosDictionary>();
        this._currentNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
    }

    /* Observable currentNode for subscribing on updates in components */
    get currentNode$(): Observable<EosDictionaryNode> {
        return this._currentNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openNode$(): Observable<EosDictionaryNode> {
        return this._openNode$.asObservable();
    }

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    openDictionary(name: string): Observable<EosDictionary> {
        return Observable.create((observer: any) => {
            /* load data if need & emit update of _dictionary$ */
        });
    }

    selectNode(dictionary: string, id: number): Observable<EosDictionaryNode> {
        return Observable.create((_observer: any) => {
            /* implemetnt open dictionary && search node logic, return node on success else null */
        });
    }

    openNode(dictionary: string, id: number) {

    }

    deleteNode(dictionary: string, id: number, hard = false) {

    }

    /* load dictionary data with API */
    private _loadDictionary(name: string) {

    }

    /* load dictionary node data with API */
    private _loadNode(id: number) {

    }
}
