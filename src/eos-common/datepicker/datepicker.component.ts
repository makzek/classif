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
    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    bsConfig: Partial<BsDatepickerConfig>;

    placement = 'bottom';
    aDate: Date;
    bsDate: Date;
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
        }
        this._manualChange = false;
    }

    inputChanged(sDate: string) {
        // convert to UTC format
        sDate = sDate.replace(/(\d{1,2}).(\d{1,2}).(\d{1,4})/g, '$3-$2-$1T00:00:00.000Z');
        const date = new Date(sDate); // convert to Date
        this._manualChange = true;
        if (date && !isNaN(date.getTime())) {
            this.bsDate = date;
            this.dateChange.emit(date);
        } else {
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
}
