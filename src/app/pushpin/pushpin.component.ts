import { Component, Input } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
})
export class PushpinComponent {
    deskList: EosDesk[];
    _link: IDeskItem;
    @Input() infoOpened: boolean;
    openStyle = '350px';
    closeStyle = '0px';

    constructor(
        private _deskSrv: EosDeskService,
        private _bcSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService
    ) {
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
        } else {
            this._msgSrv.addNewMessage(WARN_LINK_PIN);
        }
        /* tslint:enable:no-bitwise */
    }

}
