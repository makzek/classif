import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EosActiveTreeNodeService {
    private _width = 308;

    private _fon$: BehaviorSubject<any>;

    constructor() {
        this._fon$ = new BehaviorSubject<any>({
            width: 358,
            height: 48,
            top: 0
        });
    }

    get fon$(): Observable<any> {
        return this._fon$.asObservable();
    }

    public take(obj) {
        if (this._width < obj.width) {
            this._width = obj.width;
        }
        this._fon$.next({
            width: this._width,
            height: obj.height,
            top: obj.top
        })
    }
}
