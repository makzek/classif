import { Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RUBRIC_CODE_LENGTH,
    RUBRIC_TITLE_LENGTH,
    DESCRIPTION_LENGTH,
    NOTE_LENGTH, SEV_LENGTH,
    DEPARTMENT_TITLE_LENGTH,
    SURNAME_LENGTH } from '../consts/input-validation';

export class CardEditComponent {
    @Input() data: any;
    @Input() editMode = false;
    @Input() fieldsDescription: any = {};
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    readonly rubricCodeLenth = RUBRIC_CODE_LENGTH;
    readonly rubricTitleLenth = RUBRIC_TITLE_LENGTH;
    readonly descriptionLength = DESCRIPTION_LENGTH;
    readonly noteLenth = NOTE_LENGTH;
    readonly sevLength = SEV_LENGTH;
    readonly departmentTitleLenth = DEPARTMENT_TITLE_LENGTH;
    // readonly surnameLenth = SURNAME_LENGTH;
    readonly surnameLenth;

    tooltipText = '';

    change(fldKey: string, value: string) {
        this.data[fldKey] = value;
        this.onChange.emit(this.data);
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/
}
