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
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    recordChanged(data: any) {
        this.formChanged.emit(data);
    }

    recordInvalid(data: any) {
        this.formInvalid.emit(data);
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/
}
