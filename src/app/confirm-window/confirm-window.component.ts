import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'eos-confirm-window',
    templateUrl: 'confirm-window.component.html',
})

export class ConfirmWindowComponent implements OnChanges {

    public modalRef: BsModalRef;

    @Input() title: string;
    @Input() body: string;
    @Input() isOpen: boolean;
    @Output() isConfirm: EventEmitter<any> = new EventEmitter<any>();

    constructor(private modalService: BsModalService) {
       /* this.modalRef = this.modalService.show("#confirmWindow");
        this.modalRef.content.title = this.title;
        this.modalRef.content.body = this.body;*/
    }

    ngOnChanges(changes) {
        console.log(changes.isOpen);
    }

    public confirm() {
        this.isConfirm.emit(true);
        this.modalRef.hide();
    }


    public cancel() {
        this.isConfirm.emit(false);
        this.modalRef.hide();
    }
}
