import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputBase } from '../core/inputs/input-base';
import { BsDatepickerComponent, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EosUtils } from '../core/utils';

@Component({
    selector: 'eos-dynamic-form-input',
    templateUrl: 'dynamic-form-input.component.html'
})
export class DynamicFormInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;

    bsConfig: Partial<BsDatepickerConfig>;

    tooltip = {
        placement: 'bottom',
        class: 'tooltip-error',
        container: null
    };

    focused = false;
    bsDate: Date;

    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    constructor() {
        this.bsConfig = {
            locale: 'ru',
            showWeekNumbers: false,
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD.MM.YYYY',
            isDisabled: this.readonly,
            minDate: new Date('01/01/1900'),
            maxDate: new Date('12/31/2100'),
        };
    }

    get isValid() {
        return this.form.controls[this.input.key].valid;
    }

    get isDirty() {
        return this.form.controls[this.input.key].dirty;
    }

    dpChanged(value: Date) {
        const sDate = EosUtils.dateToString(value);
        this.form.controls[this.input.key].setValue(sDate);
    }

    selectClick(evt: Event) {
        if (this.readonly) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
    }
}
