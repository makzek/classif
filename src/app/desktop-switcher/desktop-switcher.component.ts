import { Component, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';

import {
    WARN_DESK_CREATING,
    WARN_DESK_EDITING,
    DANGER_DESK_CREATING
} from '../consts/messages.consts';

import { CONFIRM_DESK_DELETE } from '../consts/confirms.const';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent {
    deskList: EosDesk[];
    selectedDesk: EosDesk;
    deskName: string;
    creating = false;
    editing = false;
    updating = false;
    maxLength = 80;
    innerClick: boolean;

    notEmptyString = NOT_EMPTY_STRING;

    @ViewChild('dropDown') private _dropDown: BsDropdownDirective;

    constructor(private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private _router: Router
    ) {
        this._deskSrv.desksList.subscribe(
            (res) => this.deskList = res,
            (err) => alert('err' + err)
        );

        this._deskSrv.selectedDesk.subscribe(
            (res) => {
                if (res) { this.selectedDesk = res; }
            }, (err) => alert('err' + err)
        );
    }

    @HostListener('window:click', [])
    clickout() {
        if (!this.innerClick) {
            this._dropDown.toggle(false);
        }
        this.innerClick = false;
    }


    openEditForm(evt: Event, desk: EosDesk) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.updating) {
            return;
        }
        if (this._moreThenOneEdited()) {
            this._msgSrv.addNewMessage(WARN_DESK_EDITING);
        } else {
            desk.edited = true;
            this.deskName = desk.name;
            this.editing = true;
        }
    }

    openCreateForm() {
        if (this.updating) {
            return;
        }
        if (this._moreThenOneEdited() && !this.creating) {
            this._msgSrv.addNewMessage(WARN_DESK_CREATING);
        } else if (!this.creating) {
            this.creating = true;
            this.deskName = this._deskSrv.generateNewDeskName();
        }
    }

    saveDesk(desk: EosDesk, $evt?: Event): void {
        if ($evt) {
            $evt.stopPropagation();
        }
        if (this._deskSrv.desktopExisted(this.deskName)) {
            this._msgSrv.addNewMessage(DANGER_DESK_CREATING);
        } else {
            this.updating = true;
            let pUpdate: Promise<any>;

            desk.edited = false;
            /* todo: re-factor it to inline validation messages */
            // const _tempDeskName = this.deskName.trim().substring(0, this.maxLength);
            // const _tempDeskName = this.deskName;
            desk.name = this.deskName.trim();
            if (desk.id) {
                pUpdate = this._deskSrv.editDesk(desk);
            } else {
                pUpdate = this._deskSrv.createDesk(desk);
            }
            pUpdate.then(() => {
                this.updating = false;
                this.deskName = '';
            });
        }
    }

    create(evt: Event) {
        evt.stopPropagation();
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
            this.saveDesk(_desk);
            this.creating = false;
        }
    }

    cancelEdit(desk: EosDesk, $evt: Event) {
        $evt.stopPropagation();
        desk.edited = false;
        this.deskName = desk.name;
    }

    hideDropDown() {
        this._dropDown.toggle(false);
        this.innerClick = false;
    }

    removeDesk(desk: EosDesk, $evt: Event): void {
        $evt.stopPropagation();
        const _confrm = Object.assign({}, CONFIRM_DESK_DELETE);
        _confrm.body = _confrm.body.replace('{{name}}', desk.name);

        this.updating = true;
        this._confirmSrv
            .confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    return this._deskSrv.removeDesk(desk);
                }
                this.setInnerClick();
            })
            .then(() => {
                this.updating = false;
            });
    }

    cancelCreating($evt: Event) {
        $evt.stopPropagation();
        this.creating = false;
        this.deskName = '';
    }

    setInnerClick() {
        this.innerClick = true;
    }

    route(desk: EosDesk): void {
        if (desk.edited === false) {
            this._router.navigate(['/desk', desk.id]);
            this.hideDropDown();
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
}
