import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EosDeskService {
    private _desksList$: BehaviorSubject<EosDesk[]>;

    constructor() {
        this._desksList$ = new BehaviorSubject<EosDesk[]>([{id: '0', name: 'MainDesk', references: [],
        lastEditList: []}]);
    }

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    getDeskNameById(/* id: string */): string {
        return new EosDesk('').name;
    }

    getDeskReferencesById(/* id: string */): string[] {
        return new EosDesk('').references;
    }

    getDeskLastEditListById(/* id: string */): string[] {
        return new EosDesk('').lastEditList;
    }

    /*addReference(id: string) {

    }

    private findById(id: string): EosDesk {
    }*/

}
/* tslint:disable:max-classes-per-file */
export class EosDesk {
    id: string;
    name: string;
    references: string[];
    lastEditList: string[];

    constructor(data: any) {
        Object.assign(this, data);
    }
}
/* tslint:enable:max-classes-per-file */
