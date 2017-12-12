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
    @Input() infoOpened: boolean;
    deskList: EosDesk[];
    openStyle = '252px';
    closeStyle = '0px';

    constructor(
        private _deskSrv: EosDeskService,
        private _bcSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService,
    ) {
        _deskSrv.desksList.subscribe((res: EosDesk[]) => this.deskList = res.filter((d: EosDesk) => d.id !== 'system'));
    }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    public pin(desk: EosDesk) {
        if (!this._deskSrv.addNewItemToDesk(desk)) { this._msgSrv.addNewMessage(WARN_LINK_PIN) };
    }
}
