import { Component, Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent {
    @Input() dictionaryId: string;
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
