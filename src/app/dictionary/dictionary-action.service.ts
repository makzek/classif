import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DictionaryActionService {
    private _action$: BehaviorSubject<DICTIONARY_ACTIONS>;

    constructor() {
        this._action$ = new BehaviorSubject<DICTIONARY_ACTIONS>(null);
    }

    get action$(): Observable<DICTIONARY_ACTIONS> {
        return this._action$.asObservable();
    }

    emitAction(value: DICTIONARY_ACTIONS) {
        this._action$.next(value);
    }
}

export enum DICTIONARY_ACTIONS {
    closeTree,
    openTree,
    closeInfo,
    openInfo,
    openInfoActions,
    closeInfoActions
}
