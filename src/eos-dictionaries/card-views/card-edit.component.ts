import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent {
    @Input() dictionaryId: string;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];

    @ViewChild('cardEditEl') baseCardEditRef: BaseCardEditComponent;

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
