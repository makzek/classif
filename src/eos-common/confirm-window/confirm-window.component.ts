import { Component, EventEmitter } from '@angular/core';
// import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalRef } from 'ngx-bootstrap/modal';

export interface IConfirmWindow {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
}

export interface IConfirmWindowContent extends IConfirmWindow {
    readonly confirmEvt: EventEmitter<boolean>;
}

@Component({
    selector: 'eos-confirm-window',
    templateUrl: 'confirm-window.component.html',
})
export class ConfirmWindowComponent implements IConfirmWindowContent {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;

    readonly confirmEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public modalRef: BsModalRef) { }

    confirm() {
        this.confirmEvt.emit(true);
        this._hide();
    }

    cancel() {
        this.confirmEvt.emit(false);
        this._hide();
    }

    close() {
        this.confirmEvt.emit(undefined);
        this._hide();
    }

    private _hide() {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }
}
