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
    private deskList: EosDesk[];
    @Input() infoOpened: boolean;
    private openStyle = '252px';
    private closeStyle = '0px';

    constructor(
        private _deskSrv: EosDeskService,
        private _bcSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService,
    ) {
        this._deskSrv.desksList.subscribe((res) => this.deskList = res.filter((d) => d.id !== 'system'));
    }

    pin(desk: EosDesk) {
        if (!this._deskSrv.addNewItemToDesk(desk)) { this._msgSrv.addNewMessage(WARN_LINK_PIN) };
    }
}
