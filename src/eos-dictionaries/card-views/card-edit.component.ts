import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent {
    @Input() dictionaryId: string;
    @Input() nodeId: string;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    recordChanged(data: any) {
        this.onChange.emit(data);
    }

    onInvalid(data: any) {
        this.invalid.emit(data);
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/
}
