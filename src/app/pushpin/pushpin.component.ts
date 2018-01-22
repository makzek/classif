import { Component, Input } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk, IDesk } from '../core/eos-desk';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';
import {
    DANGER_DESK_CREATING
} from '../consts/messages.consts';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
})
export class PushpinComponent {
    @Input() infoOpened: boolean;
    deskList: EosDesk[];
    openStyle = '252px';
    closeStyle = '0px';
    public creating = false;
    public maxLength = 80;
    public deskName: string;

    constructor(
        private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
    ) {
        _deskSrv.desksList.subscribe((res: EosDesk[]) => this.deskList = res.filter((d: EosDesk) => d.id !== 'system'));
    }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    public pin(desk: EosDesk) {
        if (!this._deskSrv.appendDeskItemToView(desk)) {
            this._msgSrv.addNewMessage(WARN_LINK_PIN);
        }
    }

    public openCreateForm(evt: MouseEvent) {
        evt.stopPropagation(); /*
        if (this.updating) {
            return;
        }*/
        if (!this.creating) {
            this.creating = true;
            this.deskName = this._deskSrv.generateNewDeskName();
        }
    }

    public create() {
        /* todo: re-factor it to inline validation messages */
        if (this._deskSrv.desktopExisted(this.deskName)) {
            this.deskName = this._deskSrv.generateNewDeskName();
            this._msgSrv.addNewMessage(DANGER_DESK_CREATING);
        } else {
            const _desk: EosDesk = {
                id: null,
                name: this.deskName,
                references: [],
                edited: false,
            };
            this._deskSrv.createDesk(_desk)
                .then((desk: IDesk) => {
                    this._deskSrv.appendDeskItemToView(desk);
                    this.creating = false;
                });
        }
    }

    public cancelCreating(evt: MouseEvent) {
        evt.stopPropagation();
        this.creating = false;
    }

    public stop(evt: MouseEvent) {
        evt.stopPropagation();
    }
}
