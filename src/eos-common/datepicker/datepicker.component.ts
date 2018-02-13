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
    @Output() change: EventEmitter<Date> = new EventEmitter<Date>();
    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    bsConfig: Partial<BsDatepickerConfig>;

    placement = 'bottom';
    aDate: Date;

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
        window.addEventListener('scroll', this._handler = () => {
            this.datePicker.hide();
        }, true);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this._handler, true);
    }

    emitChange(date: Date) {
        this.change.emit(date);
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
