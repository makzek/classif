import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerComponent } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'eos-datepicker',
    templateUrl: 'datepicker.component.html',
})
export class DatepickerComponent implements OnInit, OnDestroy {
    @Input() value: any;
    @Input() isReadonly: boolean;
    @Input() placeholder = '';
    // @Input() placement = 'bottom';
    @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
    @Output() dateValid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    bsConfig: Partial<BsDatepickerConfig>;

    placement = 'bottom';
    aDate: Date;
    bsDate: Date;
    focused = false;
    valid = true;

    readonly datePattern = /.*(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19\d{2}|20\d{2}|2100).*?/;
    private _manualChange: boolean;
    private _handler;

    constructor() {
        this.bsConfig = {
            locale: 'ru',
            showWeekNumbers: false,
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD.MM.YYYY',
            isDisabled: this.isReadonly,
            minDate: new Date('01/01/1900'),
            maxDate: new Date('12/31/2100'),
        };
    }

    ngOnInit() {
        this.bsConfig = Object.assign({}, this.bsConfig, {
            isDisabled: this.isReadonly,
        });

        if (this.value instanceof Date) {
            this.aDate = this.value;
        } else if (this.value) {
            this.aDate = new Date(this.value);
        }
        this.bsDate = this.aDate;

        window.addEventListener('scroll', this._handler = () => {
            this.datePicker.hide();
        }, true);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this._handler, true);
    }

    dpChanged(date: Date) {
        // console.log('dp changed', date);
        if (!this._manualChange) {
            this.aDate = date;
            this.dateChange.emit(date);
            this.valid = true;
        }
        this.dateValid.emit(this.valid);
        this._manualChange = false;
    }

    inputChanged(sDate: string) {
        let date: Date;
        this._manualChange = true;
        sDate = sDate.trim();
        if (sDate) {
            if (this.datePattern.test(sDate)) { // if correct format
                // convert to UTC format then to Date
                date = new Date(sDate.replace(this.datePattern, '$3-$2-$1T00:00:00.000Z'));
            }

            if (date && !isNaN(date.getTime())) {
                this.valid = true;
                this.bsDate = date;
                this.dateChange.emit(date);
            } else {
                this.valid = false;
                this.bsDate = null;
                this.dateChange.emit(null);
            }
        } else {
            this.valid = true;
            this.bsDate = null;
            this.dateChange.emit(null);
        }
    }

    measureDistance() {
        if (window.innerHeight - this.datePickerWrapper.nativeElement.getBoundingClientRect().bottom >= 308) {
            this.placement = 'bottom';
        } else {
            if (this.datePickerWrapper.nativeElement.getBoundingClientRect().top >= 308) {
                this.placement = 'top';
            } else {
                if (this.datePickerWrapper.nativeElement.getBoundingClientRect().left >= 318) {
                    this.placement = 'left';
                } else {
                    this.placement = 'right';
                }
            }
        }
        this.datePicker.toggle();
        this.datePicker.toggle();
    }

    onBlur(evt) {
        this.focused = false;
    }

    onFocus(evt) {
        this.focused = true;
    }
}
