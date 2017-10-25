import { Component, Input } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
})
export class PushpinComponent {
    private _show = false;
    private deskList: EosDesk[];
    @Input() infoOpened: boolean;
    private openStyle = '350px';
    private closeStyle = '0px';

    constructor(
        private _deskSrv: EosDeskService,
        private _bcSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this._deskSrv.desksList.subscribe((res) => {
            this.deskList = res.filter((d) => d.id !== 'system');
        });
        _router.events.filter((evt: NavigationEnd) => evt instanceof NavigationEnd)
        .subscribe((evt: NavigationEnd) => {
            let _actRoute = _route.snapshot;
            while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
            this._show = _actRoute.data && _actRoute.data.showPinInBreadcrumb;
        });
    }

    pin(desk: EosDesk) {
        const items = this._bcSrv.getBreadcrumbs();
        if (items.length) {
            const deskItem: IDeskItem = {
                title: items[items.length - 1].title,
                fullTitle: items[items.length - 1].fullTitle,
                url: items[items.length - 1].url
            }
            /* tslint:disable:no-bitwise */
            if (!~desk.references.findIndex((_ref: IDeskItem) =>  _ref.url === deskItem.url)) {
                desk.references.push(deskItem);
            } else {
                this._msgSrv.addNewMessage(WARN_LINK_PIN);
            }
        }
        /*
        if (!~desk.references.findIndex((_ref) =>  _ref.url === this._link.url)) {
            let arr = this._link.title.split('/');
            arr = arr.slice(3, arr.length);
            let newName = '';
            for (const piece of arr) {
                newName += piece + '/';
            }
            newName = newName.slice(0, newName.length - 1);
            this._link.fullTitle = this._link.title;
            this._link.title = newName;
            desk.references.push(this._link);
            this._deskSrv.editDesk(desk);
        }
        */

    }

}
