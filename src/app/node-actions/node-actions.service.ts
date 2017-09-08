import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { E_RECORD_ACTIONS } from '../core/record-action';

@Injectable()
export class NodeActionsService {
    private _action$: BehaviorSubject<E_RECORD_ACTIONS>;

    constructor() {
        this._action$ = new BehaviorSubject<E_RECORD_ACTIONS>(null);
    }

    get action$(): Observable<E_RECORD_ACTIONS> {
        return this._action$.asObservable();
    }

    emitAction(value: E_RECORD_ACTIONS) {
        this._action$.next(value);
    }
}
