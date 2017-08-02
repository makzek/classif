import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EosDeskService {
    private _desksList: EosDesk[];
    private _selectedDesk: EosDesk;

    private _desksList$: BehaviorSubject<EosDesk[]>;
    private _selectedDesk$:  BehaviorSubject<EosDesk>;

    constructor() {
        this._desksList = [{
            id: '0', 
            name: 'System desk', 
            references: [],
            lastEditList: []
        },{
           id: '2', 
            name: 'Desk2', 
            references: [],
            lastEditList: [] 
        },{
            id: '100',
            name: 'Desk100',
            references: [],
            lastEditList: [],
        }];

        this._desksList$ = new BehaviorSubject(this._desksList);

        this._selectedDesk = this._desksList[0];
        
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);
    }

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    get selectedDesk(): Observable<EosDesk> {
        return this._selectedDesk$.asObservable();
    }

    setSelectedDesk(desk: EosDesk) {
        this._selectedDesk = desk;
        this._selectedDesk$.next(this._selectedDesk);
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
