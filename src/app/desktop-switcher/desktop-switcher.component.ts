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

const DEFAULT_DESKTOP_NAME = 'Мой рабочий стол';

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
    maxLength = 80;
    innerClick: boolean;

    @ViewChild('dropDown') private _dropDown: BsDropdownDirective;

    @HostListener('window:click', [])
    clickout() {
        if (!this.innerClick) {
            this._dropDown.toggle(false);
        }
        this.innerClick = false;
    }

    constructor(private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private _router: Router
    ) {
        this._deskSrv.desksList.subscribe(
            (res) => {
                this.deskList = res;
            }, (err) => alert('err' + err)
        );

        this._deskSrv.selectedDesk.subscribe(
            (res) => {
                if (res) { this.selectedDesk = res; }
            }, (err) => alert('err' + err)
        );
    }


    openEditForm(evt: Event, desk: EosDesk) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this._moreThenOneEdited()) {
            this._msgSrv.addNewMessage(WARN_DESK_EDITING);
        } else {
            desk.edited = true;
            this.deskName = desk.name;
            this.editing = true;
        }
    }

    openCreateForm() {
        if (this._moreThenOneEdited() && !this.creating) {
            this._msgSrv.addNewMessage(WARN_DESK_CREATING);
        } else if (!this.creating) {
            this.creating = true;
            this.deskName = this._generateNewDeskName();
        }
    }

    private _desktopExisted(name: string) {
        /* tslint:disable:no-bitwise */
        return !!~this.deskList.findIndex((_d) => _d.name === name);
        /* tslint:enable:no-bitwise */
    }

    private _generateNewDeskName(): string {
        let _newName = DEFAULT_DESKTOP_NAME;
        let _n = 2;
        while (this._desktopExisted(_newName)) {
            _newName = DEFAULT_DESKTOP_NAME + ' ' + _n;
            _n++;
        }
        return _newName;
    }

    saveDesk(desk: EosDesk, $evt?: Event): void {
        if ($evt) {
            $evt.stopPropagation();
        }
        desk.edited = false;
        /* todo: re-factor it to inline validation messages */
        // const _tempDeskName = this.deskName.trim().substring(0, this.maxLength);
        // const _tempDeskName = this.deskName;
        desk.name = this.deskName;
        if (desk.id) {
            this._deskSrv.editDesk(desk);
        } else {
            this._deskSrv.createDesk(desk);
        }
        this.deskName = '';
    }

    create(evt: Event) {
        evt.stopPropagation();
        /* todo: re-factor it to inline validation messages */
        if (this._desktopExisted(this.deskName)) {
            this.deskName = this._generateNewDeskName();
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

        this._confirmSrv
            .confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this._deskSrv.removeDesk(desk);
                }
                this.setInnerClick();
            })
            .catch();
    }

    cancelCreating($evt: Event) {
        $evt.stopPropagation();
        this.creating = false;
        this.deskName = '';
    }

    setInnerClick() {
        this.innerClick = true;
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
    private route(desk: EosDesk): void {
        if (desk.edited === false) {
            this._router.navigate(['/desk', desk.id]);
            this.hideDropDown();
        }
    }
}
