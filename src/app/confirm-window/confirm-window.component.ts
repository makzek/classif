import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

export interface IConfirmWindow {
    title: string;
    body: string;
    confirmEvt: EventEmitter<boolean>;
}

@Component({
    selector: 'eos-confirm-window',
    templateUrl: 'confirm-window.component.html',
})
export class ConfirmWindowComponent implements IConfirmWindow {
    title: string;
    body: string;
    confirmEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public modalRef: BsModalRef) { }

    confirm() {
        if (this.modalRef) {
            this.confirmEvt.emit(true);
            this.modalRef.hide();
        }
    }

    cancel() {
        if (this.modalRef) {
            this.confirmEvt.emit(false);
            this.modalRef.hide();
        }
    }
}
