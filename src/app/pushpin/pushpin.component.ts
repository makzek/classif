import { Component } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosMessageService } from '../services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
})
export class PushpinComponent {
    deskList: EosDesk[];
    _link: IDeskItem;

    constructor(private _deskSrv: EosDeskService,
        private _bcSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService) {
        this._deskSrv.desksList.subscribe((res) => {
            this.deskList = res.filter((d) => d.id !== 'system');
        });
        this._bcSrv.currentLink.subscribe((link) => {
            if (link) {
                this._link = link;
                // this._deskService.addRecentItem(this._link);
            }
        });
    }

    pin(desk: EosDesk) {
        /* tslint:disable:no-bitwise */
        if (!~desk.references.findIndex((_ref) =>  _ref.link === this._link.link)) {
            desk.references.push(this._link);
            this._deskSrv.editDesk(desk);
        } else {
            this._msgSrv.addNewMessage(WARN_LINK_PIN);
        }
        /* tslint:enable:no-bitwise */
    }

}
