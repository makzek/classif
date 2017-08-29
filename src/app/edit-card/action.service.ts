import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable() export class EditCardActionService {
    private _action$: BehaviorSubject<string>;
    private _mode$: BehaviorSubject<string>;

    constructor() {
        this._action$ = new BehaviorSubject<string>(null);
        this._mode$ = new BehaviorSubject<string>(null);
    }

    get action$(): Observable<string> {
        return this._action$.asObservable();
    }

    get mode$(): Observable<string> {
        return this._mode$.asObservable();
    }

    emitAction(value: string) {
        this._action$.next(value);
    }

    emitMode(value: string) {
        this._mode$.next(value);
    }
}
