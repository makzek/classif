import { Component, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosMessageService } from '../services/eos-message.service';
import { ConfirmWindowService } from '../confirm-window/confirm-window.service';

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
            this.messageService.addNewMessage({
                type: 'warning',
                title: 'Ошибка редактирования рабочего стола:',
                msg: 'одноверенное редактирование нескольких рабочих столов запрещено'
            });
        } else {
            desk.edited = true;
            this.deskName = desk.name;
            this.editing = true;
        }
    }

    openCreateForm() {
        this.creating = true;
        this.deskName = 'Мой рабочий стол ' + this.deskList.length;
    }

    saveDesk(desk: EosDesk): void {
        desk.edited = false;
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
        const _desk: EosDesk = {
            id: null,
            name: this.deskName,
            references: [],
            edited: false,
        };
        this.closeAndSave(_desk);
        this.creating = false;
    }

    closeAndSave(desk: EosDesk) {
        this.saveDesk(desk);
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
        this.setInnerClick();
        this._confirmSrv.confirm('Удалить?', 'Вы действительно хотите удалить рабочий стол ' + desk.name + '?')
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this.eosDeskService.removeDesk(desk);
                }
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
        let edited = 0;
        this.deskList.forEach((desk) => {
            if (desk.edited) {
                edited++;
            }
        });
        return edited > 0;
    }
}
