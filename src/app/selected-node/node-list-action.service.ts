import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NodeListActionsService {
    private _delete$: BehaviorSubject<boolean>;
    private _edit$: BehaviorSubject<boolean>;
    private _nextItem$: BehaviorSubject<boolean>;
    private _physicallyDelete$: BehaviorSubject<boolean>;
    private _restore$: BehaviorSubject<boolean>;
    private _checkAll$: BehaviorSubject<boolean>;

    constructor() {
        this._delete$ = new BehaviorSubject<boolean>(null);
        this._edit$ = new BehaviorSubject<boolean>(null);
        this._nextItem$ = new BehaviorSubject<boolean>(null);
        this._physicallyDelete$ = new BehaviorSubject<boolean>(null);
        this._restore$ = new BehaviorSubject<boolean>(null);
        this._checkAll$ = new BehaviorSubject<boolean>(null);
    }

    get delete$(): Observable<boolean> {
        return this._delete$.asObservable();
    }

    get edit$(): Observable<boolean> {
        return this._edit$.asObservable();
    }

    get nextItem$(): Observable<boolean> {
        return this._nextItem$.asObservable();
    }

    get physicallyDelete$(): Observable<boolean> {
        return this._physicallyDelete$.asObservable();
    }

    get restore$(): Observable<boolean> {
        return this._restore$.asObservable();
    }

    get checkAll$(): Observable<boolean> {
        return this._checkAll$.asObservable();
    }

    emitDelete() {
        this._delete$.next(true);
    }

    emitEdit() {
        this._edit$.next(true);
    }

    emitNextItem(value: boolean) {
        this._nextItem$.next(value);
    }

    emitPhysicallyDelete() {
        this._physicallyDelete$.next(true);
    }

    emitRestore() {
        this._restore$.next(true);
    }

    emitCheckAll(value: boolean) {
        this._checkAll$.next(value);
    }
}
