import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { E_RECORD_ACTIONS } from '../core/record-action';

@Injectable()
/**
 * @deprecated
 */
export class NodeActionsService {
    private _action$: Subject<E_RECORD_ACTIONS>;

    constructor() {
        this._action$ = new Subject<E_RECORD_ACTIONS>();
    }

    get action$(): Observable<E_RECORD_ACTIONS> {
        return this._action$.asObservable();
    }

    emitAction(value: E_RECORD_ACTIONS) {
        this._action$.next(value);
    }
}
