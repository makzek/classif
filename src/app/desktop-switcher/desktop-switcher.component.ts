import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router } from '@angular/router';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../services/eos-desk.service';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent {
    deskList: EosDesk[];
    selectedDesk: EosDesk;
    public modalRef: BsModalRef;
    editedDesk: EosDesk;
    emptyDesk: EosDesk = {
        id: null,
        name: null,
        references: [],
    };
    constructor(private eosDeskService: EosDeskService, private modalService: BsModalService, private router: Router) {
        this.eosDeskService.desksList.subscribe(
            (res) => {
                this.deskList = res;
            }, (err) => alert('err' + err)
        );

        this.eosDeskService.selectedDesk.subscribe(
            (res) => {
                this.selectedDesk = res;
            }, (err) => alert('err' + err)
        );
    }

    selectDesk(desk: EosDesk): void {
        //this.eosDeskService.setSelectedDesk(desk);
    }

    editDesk(desk: EosDesk): void {
        this.modalRef.hide();
        this.eosDeskService.editDesk(desk);
    }

    removeDesk(desk: EosDesk): void {
        this.eosDeskService.removeDesk(desk);
    }

    createDesk(desk: EosDesk): void {
        this.modalRef.hide();
        this.eosDeskService.createDesk(desk);
    }

    public openEditModal(template: TemplateRef<any>, desk: EosDesk) {
        this.editedDesk = desk;
        this.modalRef = this.modalService.show(template);
    }

    public openCreateModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
}
