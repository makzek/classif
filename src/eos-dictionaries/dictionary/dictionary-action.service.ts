import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DictionaryActionService {
    private _action$: BehaviorSubject<DICTIONARY_ACTIONS>;
    private _state$: BehaviorSubject<DICTIONARY_STATES>;

    constructor() {
        this._action$ = new BehaviorSubject<DICTIONARY_ACTIONS>(null);
        this._state$ = new BehaviorSubject<DICTIONARY_STATES>(null);
    }

    get action$(): Observable<DICTIONARY_ACTIONS> {
        return this._action$.asObservable();
    }

    get state$(): Observable<DICTIONARY_STATES> {
        return this._state$.asObservable();
    }

    emitAction(value: DICTIONARY_ACTIONS) {
        this._action$.next(value);
    }

    emitState(value: DICTIONARY_STATES) {
        this._state$.next(value);
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


export enum DICTIONARY_STATES {
    full,
    selected,
    info,
    tree
}
