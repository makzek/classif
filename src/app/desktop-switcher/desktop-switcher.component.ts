import { Component, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosMessageService } from '../services/eos-message.service';
import { ConfirmWindowService } from '../confirm-window/confirm-window.service';

import {
    WARN_DESK_CREATING,
    WARN_DESK_EDITING,
} from '../consts/messages.consts';

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

    constructor(private eosDeskService: EosDeskService,
        private router: Router,
        private messageService: EosMessageService,
        private _confirmSrv: ConfirmWindowService
    ) {
        this.eosDeskService.desksList.subscribe(
            (res) => {
                this.deskList = res;
            }, (err) => alert('err' + err)
        );

        this.eosDeskService.selectedDesk.subscribe(
            (res) => {
                if (res) { this.selectedDesk = res; }
            }, (err) => alert('err' + err)
        );
    }


    openEditForm(evt: Event, desk: EosDesk) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this._moreThenOneEdited()) {
            this.messageService.addNewMessage(WARN_DESK_EDITING);
        } else {
            desk.edited = true;
            this.deskName = desk.name;
            this.editing = true;
        }
    }

    openCreateForm() {
        if (this._moreThenOneEdited()) {
            this.messageService.addNewMessage(WARN_DESK_CREATING);
        } else {
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
        const _posibleNumbers = [0, 1, 2, 3, 4];
        return 'Мой рабочий стол ' + _posibleNumbers.findIndex((_n) => !this._desktopExisted('Мой рабочий стол ' + _n));
    }

    saveDesk(desk: EosDesk): void {
        desk.edited = false;
        /* todo: re-factor it to inline validation messages */
        const _tempDeskName = this.deskName.trim().substring(0, this.maxLength);
        if (_tempDeskName === '') {
            const errPartTitle = desk.id ? 'редактирования' : 'создания';
            this.messageService.addNewMessage({
                type: 'warning',
                title: 'Ошибка ' + errPartTitle + ' рабочего стола:',
                msg: 'нельзя ввести пустое имя рабочего стола'
            });
            if (desk.id) {
                this.cancelEdit(desk);
            } else {
                this.cancelCreating();
            }
        } else {
            desk.name = _tempDeskName;
            if (desk.id) {
                this.eosDeskService.editDesk(desk);
            } else {
                this.eosDeskService.createDesk(desk);
            }
        }
        this.deskName = '';
    }

    create() {
        /* todo: re-factor it to inline validation messages */
        if (this._desktopExisted(this.deskName)) {
            this.deskName = this._generateNewDeskName();
            this.messageService.addNewMessage({
                type: 'danger',
                title: 'Ошибка создания рабочего стола:',
                msg: 'нельзя создавать рабочие столы с одинаковым именем'
            });
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

    cancelEdit(desk: EosDesk) {
        desk.edited = false;
        this.deskName = desk.name;
    }

    hideDropDown() {
        this._dropDown.toggle(false);
        this.innerClick = false;
    }

    removeDesk(desk: EosDesk): void {
        this._confirmSrv.confirm('Удалить?', 'Вы действительно хотите удалить рабочий стол ' + desk.name + '?')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this.eosDeskService.removeDesk(desk);
                }
                this.setInnerClick();
            });
    }

    cancelCreating() {
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
}
