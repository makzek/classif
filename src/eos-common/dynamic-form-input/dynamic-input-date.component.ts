import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDatepickerConfig, BsDatepickerComponent } from 'ngx-bootstrap/datepicker';
import { EosUtils } from '../core/utils';

@Component({
    selector: 'eos-dynamic-input-date',
    templateUrl: 'dynamic-input-date.component.html'
})
export class DynamicInputDateComponent extends DynamicInputBase implements OnInit {
    bsConfig: Partial<BsDatepickerConfig>;
    bsDate: Date;
    placement = 'bottom';

    get currentValue(): string {
        const control = this.control;
        if (control) {
            if (control.value) {
                return EosUtils.dateToStringValue(control.value);
            }
        }
        return this.input.label;
    }

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

    ngOnInit() {
        if (this.datePickerWrapper) {
            if (window.innerHeight - this.datePickerWrapper.nativeElement.getBoundingClientRect().bottom >= 308) {
                this.placement = 'bottom';
            } else if (this.datePickerWrapper.nativeElement.getBoundingClientRect().top >= 308) {
                this.placement = 'top';
            } else if (this.datePickerWrapper.nativeElement.getBoundingClientRect().left >= 318) {
                this.placement = 'left';
            } else {
                this.placement = 'right';
            }
        }
    }
}
