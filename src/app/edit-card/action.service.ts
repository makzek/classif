import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


export enum EDIT_CARD_ACTIONS {
    create,
    save,
    cancel,
    makeEmptyObject
};

export enum EDIT_CARD_MODES {
    edit,
    view,
    unsavedChanges
};

@Injectable() export class EditCardActionService {
    private _action$: BehaviorSubject<EDIT_CARD_ACTIONS>;
    private _mode$: BehaviorSubject<EDIT_CARD_MODES>;

    constructor() {
        this._action$ = new BehaviorSubject<EDIT_CARD_ACTIONS>(null);
        this._mode$ = new BehaviorSubject<EDIT_CARD_MODES>(null);
    }

    get action$(): Observable<EDIT_CARD_ACTIONS> {
        return this._action$.asObservable();
    }

    get mode$(): Observable<EDIT_CARD_MODES> {
        return this._mode$.asObservable();
    }

    emitAction(value: EDIT_CARD_ACTIONS) {
        this._action$.next(value);
    }

    emitMode(value: EDIT_CARD_MODES) {
        this._mode$.next(value);
    }
}
