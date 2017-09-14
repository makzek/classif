import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import { Router, ActivatedRoute } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../services/eos-message.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosDesk } from '../core/eos-desk';

const DEFAULT_DESKS: EosDesk[] = [{
    id: 'system',
    name: 'System desk',
    references: [],
    edited: false,
}, {
    id: '2',
    name: 'Desk2',
    references: [{
        link: '/spravochniki/rubricator',
        title: 'Рубрикатор',
        edited: false,
    }],
    edited: false,
}, {
    id: '100',
    name: 'Desk100',
    references: [],
    edited: false,
}];

@Injectable()
export class EosDeskService {
    private _desksList: EosDesk[];
    private _selectedDesk: EosDesk;
    private _recentItems: IDeskItem[];

    private _desksList$: BehaviorSubject<EosDesk[]>;
    private _selectedDesk$: BehaviorSubject<EosDesk>;
    private _recentItems$: BehaviorSubject<IDeskItem[]>;

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    get selectedDesk(): Observable<EosDesk> {
        return this._selectedDesk$.asObservable();
    }

    get recentItems(): Observable<IDeskItem[]> {
        return this._recentItems$.asObservable();
    }

    constructor(
        private eosDictionaryService: EosDictService,
        private eosMessageService: EosMessageService,
        private router: Router
    ) {
        this._desksList = DEFAULT_DESKS;

        this._desksList$ = new BehaviorSubject(this._desksList);
        this._selectedDesk = this._desksList[0];
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);
        this._recentItems$ = new BehaviorSubject(this._recentItems);

        eosDictionaryService.getDictionariesList()
            .then((dictionariesList) => {
                this._desksList[0].references = dictionariesList.map((dictionary) => {
                    return {
                        link: '/spravochniki/' + dictionary.id,
                        title: dictionary.title,
                        edited: false,
                    };
                });

                if (this._selectedDesk$ && this._selectedDesk) {
                    if (this._selectedDesk.id === 'system') {
                        this._selectedDesk$.next(this._desksList[0])
                    }
                };
            });

        this._recentItems = [];
    }

    /* getDesk(id: string): Promise<EosDesk> {
        return new Promise((res, rej) => { // tslint:disable-line:no-unused-variable
            res(this._desksList.find((_desk) => id === _desk.id));
        });
    }

    getName(id: string): Observable<string> {
        const _name = new Subject<string>();
        _name.next(this._desksList.find((_desk) => id === _desk.id).name);
        return _name;
    }*/

    setSelectedDesk(deskId: string) {
        this._selectedDesk = this._desksList.find((d) => d.id === deskId);
        this._selectedDesk$.next(this._selectedDesk || this._desksList[0]);
    }

    unpinRef(link: IDeskItem): void {
        this._selectedDesk.references = this._selectedDesk.references.filter((r) => r !== link);
        this._selectedDesk$.next(this._selectedDesk);
    }

    addRecentItem(link: IDeskItem): void {
        this._recentItems.push(link);
        if (this._recentItems.length > 10) {
            this._recentItems.shift();
        }
        this._recentItems$.next(this._recentItems);
    }

    removeDesk(desk: EosDesk): void {
        if (this._selectedDesk === desk) {
            this._selectedDesk = this._desksList[0]; // system desk
            this._selectedDesk$.next(this._selectedDesk);
        }

        this._desksList = this._desksList.filter((d) => d !== desk);
        this._desksList$.next(this._desksList);
    }

    editDesk(desk: EosDesk): void {
        this._desksList.splice(this._desksList.indexOf(desk), 1, desk);
        this._desksList$.next(this._desksList);
    }

    createDesk(desk: EosDesk): void {
        if (this._desksList.length < 6) {// users desk + system desk
            if (!desk.id) { desk.id = (this._desksList.length + 1).toString(); }
            this._desksList.push(desk);
            this._desksList$.next(this._desksList);
        } else {
            this.eosMessageService.addNewMessage({
                type: 'warning',
                title: 'Предупреждение: максимальное колличество рабочих столов!',
                msg: 'У вас может быть не более 5 рабочих столов',
            });
        }
    }
}
