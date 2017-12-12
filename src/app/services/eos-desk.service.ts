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
import { debug } from 'util';

import { AppContext} from '../../eos-rest/services/appContext.service';
import { SRCH_VIEW, USER_CL} from '../../eos-rest/interfaces/structures';

import {ViewManager} from '../../eos-rest/services/viewManager';
import { _ES } from 'eos-rest/core/consts';



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
        fullTitle: 'Рубрикатор'
    }],
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
        private _router: Router,
        private _appCtx: AppContext,
        private viewManager: ViewManager
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
        this._appCtx.ready().then(x => {
            this.readDeskList();
        })
    }

    private readDeskList() {
        const view = this._appCtx.UserViews.filter(uv => uv.SRCH_KIND_NAME === 'clmanDesc');
        for (let i = 0; i < view.length; i++) {
            this._desksList.push(this.readDesc(view[i]));
            this._desksList$.next(this._desksList);
        }
    }

    private readDesc(v: SRCH_VIEW): EosDesk {
        const res = <EosDesk>{id: v.ISN_VIEW.toString(), name: v.VIEW_NAME, edited: false, references: []};
        const cols = v.SRCH_VIEW_DESC_List;
        for ( let i = 0; i !== cols.length; i++) {
            const col = cols[i];
            const di = this.mapToDefaultDescItem( cols[i].BLOCK_ID);
            res.references.push(di);
        }
        return res;
    }

    private mapToDefaultDescItem(blockId: string): IDeskItem {
        const defaults = this._desksList[0].references;
        const s  = '/spravochniki/' + blockId;
        const result = defaults.find(it => it.url === s);
        // TODO: clone?
        return result;
    }

    private findView(deskId: string) {
        const isn = parseInt(deskId, 0);
        const v = this._appCtx.UserViews.find(uv => uv.ISN_VIEW === isn)
        if (v === undefined) {
            // TODO: может отругаться?
        }
        return v;
    }

    private appendDeskItemToView(deskId: string, item: IDeskItem) {
        const v = this.findView(deskId);
        if (v !== undefined) {
            const col = this.viewManager.addViewColumn(v);
            col.BLOCK_ID = item.url.split('/')[2];
            col.LABEL = item.title;
            this.viewManager.saveView(v);
        }
    }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    public addNewItemToDesk(desk: IDesk) {
        const item: IDeskItem = {
            title: this._dictSrv.dictionary.title,
            fullTitle: this._dictSrv.dictionary.title,
            url: this._router.url
        }
        /* tslint:disable */
        if (!~desk.references.findIndex((_ref: IDeskItem) => _ref.url === item.url)) {
            desk.references.push(item);
            this.appendDeskItemToView(desk.id, item);
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
        const v = this.findView(this._selectedDesk.id)
        if (v !== undefined) {
            const blockId = link.url.split('/')[2];
            this.viewManager.delViewColumn(v, blockId);
            this.viewManager.saveView(v);
        }

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
        const v = this.findView(desk.id);
        if ( v !== undefined) {
            v._State = _ES.Deleted;
            this.viewManager.saveView(v);
        }
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
        if (this._desksList.length > 5) {// users desk + system desk
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение: максимальное колличество рабочих столов!',
                msg: 'У вас может быть не более 5 рабочих столов',
            });
        }

        const viewMan = this.viewManager;
        const newDesc = viewMan.createView('clmanDesc');
        newDesc.VIEW_NAME = desk.name;

        viewMan.saveView(newDesc).then(isn_view => {
//            alert('новый стол сохранен!' + isn_view.toString());
            // TODO: надо перечитать AppContext. Здесь или в другом месте не понимаю.
            desk.id = isn_view.toString();
            this._desksList.push(desk);
            this._desksList$.next(this._desksList);
        });

    }
}
