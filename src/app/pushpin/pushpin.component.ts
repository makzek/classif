import { Component, Input } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';
import {
    WARN_DESK_CREATING,
    WARN_DESK_EDITING,
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
        if (!this._deskSrv.appendDeskItemToView(desk)) { this._msgSrv.addNewMessage(WARN_LINK_PIN) };
    }

    public openCreateForm(evt: MouseEvent) {
        evt.stopPropagation(); /*
        if (this.updating) {
            return;
        }*/
        if (this._moreThenOneEdited() && !this.creating) {
            this._msgSrv.addNewMessage(WARN_DESK_CREATING);
        } else if (!this.creating) {
            this.creating = true;
            this.deskName = this._deskSrv.generateNewDeskName();
        }
    }

    private _moreThenOneEdited(): boolean {
        if (this.creating) {
            return true;
        } else {
            let edited = 0;
            this.deskList.forEach((desk) => {
                if (desk.edited) {
                    edited++;
                }
            });
            return edited > 0;
        }
    }

    public create(evt: MouseEvent) {
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
            this._deskSrv.createDesk(_desk).then((value) => {
                console.log(value);
                this._deskSrv.appendDeskItemToView(_desk);
                this.creating = false;
            }).catch((err) => console.log(err));
        }
    }

    public cancelCreating(evt: MouseEvent) {
        evt.stopPropagation();
        this.creating = false;
    }

    public saveDesk(desk: EosDesk, $evt?: Event): void {
        if ($evt) {
            $evt.stopPropagation();
        }
        if (this._deskSrv.desktopExisted(this.deskName)) {
            this._msgSrv.addNewMessage(DANGER_DESK_CREATING);
        } else {
            // this.updating = true;
            let pUpdate: Promise<any>;

            desk.edited = false;
            /* todo: re-factor it to inline validation messages */
            // const _tempDeskName = this.deskName.trim().substring(0, this.maxLength);
            // const _tempDeskName = this.deskName;
            desk.name = this.deskName;
            if (desk.id) {
                pUpdate = this._deskSrv.editDesk(desk);
            } else {
                pUpdate = this._deskSrv.createDesk(desk);
            }
            pUpdate.then(() => {
                // this.updating = false;
                this.deskName = '';
            });
        }
    }

    op(evt: MouseEvent) {
        evt.stopPropagation();
    }
}
