import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export enum DICTIONARY_ACTIONS {
    closeTree,
    openTree,
    closeInfo,
    openInfo,
}

export enum DICTIONARY_STATES {
    full, // For what?
    selected,
    info,
    tree
}

@Injectable()
export class DictionaryActionService {
    private _action$: BehaviorSubject<DICTIONARY_ACTIONS>;
    private _state = DICTIONARY_STATES.selected;

    closeAll = false;

    constructor() {
        this._action$ = new BehaviorSubject<DICTIONARY_ACTIONS>(null);
    }

    get action$(): Observable<DICTIONARY_ACTIONS> {
        return this._action$.asObservable();
    }

    emitAction(value: DICTIONARY_ACTIONS) {
        this._action$.next(value);
    }

    get state() {
        return this._state;
    }

    set state(val: number) {
        this._state = val
    }

}
