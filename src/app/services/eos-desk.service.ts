import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';

@Injectable()
export class EosDeskService {
    private _desksList: EosDesk[];
    private _selectedDesk: EosDesk;
    private _lastEditItems: Array<{ id: string, title: string }>;

    private _desksList$: BehaviorSubject<EosDesk[]>;
    private _selectedDesk$:  BehaviorSubject<EosDesk>;
    private _lastEditItems$: BehaviorSubject<Array<{ id: string, title: string }>>;

    constructor(private eosDictionaryService: EosDictService) {
        this._desksList = [{
            id: '0', 
            name: 'System desk', 
            references: [],
        },{
           id: '2', 
            name: 'Desk2', 
            references: [{
                id: 'rubricator', 
                title: 'Рубрикатор',
            }],
        },{
            id: '100',
            name: 'Desk100',
            references: [],
        }];

        eosDictionaryService.dictionariesList$
            .subscribe((dictionariesList) => {
                this._desksList[0].references = dictionariesList;
                if (this._selectedDesk$) {
                    this._selectedDesk = this._desksList[0];
                    this._selectedDesk$.next(this._desksList[0])
                };
            });
        this._desksList$ = new BehaviorSubject(this._desksList);
        this._selectedDesk = this._desksList[0];
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);
        this._lastEditItems$ = new BehaviorSubject([{
                id: 'rubricator', 
                title: 'Рубрикатор',
            }]);

    }

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    get selectedDesk(): Observable<EosDesk> {
        return this._selectedDesk$.asObservable();
    }

    get lastEditItems(): Observable<Array<{ id: string, title: string }>> {
        return this._lastEditItems$.asObservable();
    }

    setSelectedDesk(desk: EosDesk) {
        this._selectedDesk = desk;
        this._selectedDesk$.next(this._selectedDesk);
    }

    pinRef(i: number, link: { id: string, title: string }): void {
        this._desksList[i].references.push(link);
        this._desksList$.next(this._desksList);
    }

    unpinRef(i: number, link: { id: string, title: string }): void {
        this._desksList[i].references.splice(this._desksList[i].references.indexOf(link), 1);
        this._desksList$.next(this._desksList);
    }

    addEditItem(link: { id: string, title: string }): void {
        if (this._lastEditItems.length < 10) {
            this._lastEditItems.push(link);
        } else {
            this._lastEditItems.reverse();
            this._lastEditItems.pop();
            this._lastEditItems.reverse();
            this._lastEditItems.push(link);
        }
        this._lastEditItems$.next(this._lastEditItems);
    }

    removeDesk(desk: EosDesk): void {
        if(this._selectedDesk === desk) {
            console.log('Это текущий стол!!');
        } else {
            this._desksList.splice(this._desksList.indexOf(desk), 1);
            this._desksList$.next(this._desksList);
        }
    }

    editDesk(desk: EosDesk): void {
        this._desksList.splice(this._desksList.indexOf(desk), 1, desk);
        this._desksList$.next(this._desksList);
    }

    createDesk(desk: EosDesk): void {
        this._desksList.push(desk);
        this._desksList$.next(this._desksList);
    }
}

/* tslint:disable:max-classes-per-file */
export class EosDesk {
    id: string;
    name: string;
    references: Array<{ id: string, title: string }>;

    constructor(data: any) {
        Object.assign(this, data);
    }
}
/* tslint:enable:max-classes-per-file */
