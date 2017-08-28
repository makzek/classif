import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'eos-confirm-window',
    templateUrl: 'confirm-window.component.html',
})

export class ConfirmWindowComponent {

    public modalRef: BsModalRef;

    title: string;
    text: string;
    isConfirm: boolean;

    constructor(private modalService: BsModalService) {}

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public agree() {
        this.isConfirm = true;
        this.modalRef.hide();
    }

    public cancel() {
        this.isConfirm = false;
        this.modalRef.hide();
    }
}
