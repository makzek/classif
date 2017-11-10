import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { EosDictionary } from '../../eos-dictionaries/core/eos-dictionary';
// import {Subject} from 'rxjs/Subject';

import { Router, ActivatedRoute } from '@angular/router';

import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosDesk, IDesk } from '../core/eos-desk';

const DEFAULT_DESKS: EosDesk[] = [{
    id: 'system',
    name: 'Стандартный рабочий стол',
    references: [],
    edited: false,
}, {
    id: '2',
    name: 'Desk2',
    references: [{
        url: '/spravochniki/rubricator',
        title: 'Рубрикатор',
        fullTitle: 'Главная/Справочники/Рубрикатор'
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
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this._desksList = DEFAULT_DESKS;

        this._desksList$ = new BehaviorSubject(this._desksList);
        this._selectedDesk = this._desksList[0];
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);
        this._recentItems$ = new BehaviorSubject(this._recentItems);

        _dictSrv.getDictionariesList()
            .then((dictionariesList) => {
                this._desksList[0].references = dictionariesList.map((dictionary) => {
                    return {
                        url: '/spravochniki/' + dictionary.id,
                        title: dictionary.title,
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

    public addNewItemToDesk(desk: IDesk) {
        const item: IDeskItem = {
            title: null,
            fullTitle: null,
            url: this._router.url
        }
        const segments = this._router.url.split('/');
        if (segments.length === 3) {
            this._dictSrv.openDictionary(segments[2]).then((dictionary: EosDictionary) => {
                item.fullTitle = dictionary.title;
                item.title = dictionary.title;
            })
        } else if (segments.length === 4) {
            this._dictSrv.getNode(segments[2], segments[3]).then((node: EosDictionaryNode) => {
                item.fullTitle = node.data.CLASSIF_NAME;
                item.title = node.data.CLASSIF_NAME;
            })
        } else if (segments.length === 5) {
            this._dictSrv.getNode(segments[2], segments[3]).then((node: EosDictionaryNode) => {
                if (segments[4] === 'view') {
                    item.fullTitle = node.data.CLASSIF_NAME + ' - Просмотр';
                    item.title = node.data.CLASSIF_NAME + ' - Просмотр';
                } else if (segments[4] === 'edit') {
                    item.fullTitle = node.data.CLASSIF_NAME + ' - Редактирование';
                    item.title = node.data.CLASSIF_NAME + ' - Редактирование';
                }
            })
        }
        /* tslint:disable */
        if (!~desk.references.findIndex((_ref: IDeskItem) => _ref.url === item.url)) {
            desk.references.push(item);
            return true;
        } else {
            return false;
        }
        /*tslint:enable*/
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
        console.log(link)
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
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение: максимальное колличество рабочих столов!',
                msg: 'У вас может быть не более 5 рабочих столов',
            });
        }
    }
}
