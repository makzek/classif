import { Output, Input, EventEmitter } from '@angular/core';

import { TITLE_LENGTH, DESCRIPTION_LENGTH } from '../consts/input-validation';

export class CardEditComponent {
    @Input() data: any = {};
    @Input() editMode = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    readonly titleLenth = TITLE_LENGTH;
    readonly descriptionLength = DESCRIPTION_LENGTH;

    change(fldKey: string, value: string) {
        this.data[fldKey] = value;
        this.onChange.emit(this.data);
    }

    clean(field: string, value: string) {
        this.change(field, value);
    }
}
