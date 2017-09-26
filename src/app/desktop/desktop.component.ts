import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';

import { IDeskItem } from '../core/desk-item.interface';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_LINK_DELETE } from '../consts/confirms.const';

@Component({
    selector: 'eos-desktop',
    templateUrl: 'desktop.component.html',
})
export class DesktopComponent implements OnDestroy {
    referencesList: IDeskItem[];
    recentItems: IDeskItem[];
    deskId: string;

    historyToLeft = false;

    private _routerSubscription: Subscription;
    private _selectedDeskSubscription: Subscription;
    private _recentItemsSubscription: Subscription;
    private _routeSubscription: Subscription;

    constructor(
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService
    ) {
        this.referencesList = [];
        this._routerSubscription = this._router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this._dictSrv.getDictionariesList());

        this._selectedDeskSubscription = _deskSrv.selectedDesk.subscribe(
            (desk) => {
                if (desk) {
                    this._update(desk.references);
                    this.deskId = desk.id;
                }
            }
        );

        this._recentItemsSubscription = _deskSrv.recentItems.subscribe(
            (items) => this.recentItems = items
        );

        this._routeSubscription = _route.url.subscribe(
            (res) => {
                const link = res[0] || { path: 'system' };
                _deskSrv.setSelectedDesk(link.path);
            }
        );
    }

    ngOnDestroy() {
        this._routerSubscription.unsubscribe();
        this._selectedDeskSubscription.unsubscribe();
        this._recentItemsSubscription.unsubscribe();
        this._routeSubscription.unsubscribe();
    }

    _update(dictionariesList: IDeskItem[]) {
        this.referencesList = dictionariesList;
    }

    removeLink(link: IDeskItem): void {
        const _confrm = Object.assign({}, CONFIRM_LINK_DELETE);
        _confrm.body = _confrm.body.replace('{{link}}', link.title);

        this._confirmSrv
            .confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this._deskSrv.unpinRef(link);
                }
            })
            .catch();
    }

    changeName(evt: Event, ref: IDeskItem) {
        this.stopDefault(evt);
        ref.edited = true;
    }

    save(evt: Event, ref: IDeskItem) {
        ref.edited = false;
    }

    stopDefault(evt: Event) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    setCursor(event) {
        /* set the cursor position at the end of textarea - special trick for IE and Edge */
        event.target.selectionStart = event.target.value.length;
    }
}
