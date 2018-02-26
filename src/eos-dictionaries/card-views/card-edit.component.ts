import { Component, Output, Input, EventEmitter } from '@angular/core';
@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent {
    @Input() dictionaryId: string;
    @Input() nodeId: string;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() editFields: string[];
    @Input() fieldsDescription: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];

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
