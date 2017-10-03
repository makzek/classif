import { Output, Input, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CODE_LENGTH, TITLE_LENGTH, DESCRIPTION_LENGTH } from '../consts/input-validation';

export class CardEditComponent {
    @Input() data: any;
    @Input() editMode = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    readonly codeLenth = CODE_LENGTH;
    readonly titleLenth = TITLE_LENGTH;
    readonly descriptionLength = DESCRIPTION_LENGTH;

    change(fldKey: string, value: string, formInvalid?: boolean) {
        this.data[fldKey] = value;
        this.onChange.emit(this.data);
        this.invalid.emit(formInvalid);
    }

    clean(field: string, value: string, formInvalid?: boolean) {
        this.change(field, value, formInvalid);
    }
}
