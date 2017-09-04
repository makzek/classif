import { Component, Input, Output, OnChanges, EventEmitter, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
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

    @ViewChild('confirmWindow')
    private template: TemplateRef<any>;

    constructor(private modalService: BsModalService) {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes.isOpen, this.template);
        if (this.template && changes.isOpen.currentValue) {
            this.modalService.show(this.template);
        }
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
