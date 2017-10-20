import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerComponent} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { ru } from 'ngx-bootstrap/locale';
defineLocale('ru', ru);

@Component({
    selector: 'eos-datepicker',
    templateUrl: 'datepicker.component.html',
})
export class DatepickerComponent implements OnInit, OnDestroy {
    @Input() value = Date();
    @Input() readonly = false;
    @Input() placeholder = '';
    // @Input() placement = 'bottom';
    @Output() change: EventEmitter<Date> = new EventEmitter<Date>();
    bsConfig: Partial<BsDatepickerConfig>;

    placement = 'bottom';

    private _handler;

    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerComponent;

    constructor() {
        this.bsConfig = {
            locale: 'ru',
            showWeekNumbers: false,
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD.MM.YYYY',
            isDisabled: true,
        };
    }

    ngOnInit() {
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
        if (window.innerHeight - this.datePickerWrapper.nativeElement.getBoundingClientRect().bottom  >= 308) {
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
