import { Component, ElementRef, ViewChild } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDatepickerConfig, BsDatepickerComponent } from 'ngx-bootstrap/datepicker';
// import { EosUtils } from '../core/utils';

@Component({
    selector: 'eos-dynamic-input-date',
    templateUrl: 'dynamic-input-date.component.html'
})
export class DynamicInputDateComponent extends DynamicInputBase {
    bsConfig: Partial<BsDatepickerConfig>;
    bsDate: Date;

    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    constructor() {
        super();
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

    dpChanged(value: Date) {
        this.form.controls[this.input.key].setValue(value);
        this.onBlur();
    }
}
