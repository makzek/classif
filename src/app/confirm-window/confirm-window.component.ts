import { Component, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'eos-confirm-window',
    templateUrl: 'confirm-window.component.html',
})

export class ConfirmWindowComponent {

    public modalRef: BsModalRef;

    @Input() title: string;
    @Input() body: string;
    @Output() result: EventEmitter<any> = new EventEmitter<any>();

    constructor(private modalService: BsModalService) {}

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public confirm() {
        this.result.emit(true);
        this.modalRef.hide();
    }

    public cancel() {
        this.result.emit(false);
        this.modalRef.hide();
    }
}
