import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable() export class EditCardActionService {
    private _action$: BehaviorSubject<string>;
    _currTab = 0;

    constructor() {
        this._action$ = new BehaviorSubject<string>(null);
    }

    get action$(): Observable<string> {
        return this._action$.asObservable();
    }

    emitAction(value: string) {
        this._action$.next(value);
    }

    get currTab(): number {
        return this._currTab;
    }

    set currTab(val: number) {
        this._currTab = val;
    }
}
