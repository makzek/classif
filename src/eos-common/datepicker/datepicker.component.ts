import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
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

    @ViewChild('dpw') datePickerWrapper: ElementRef;
    @ViewChild('dp') datePicker;

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
        this.measureDistance();
        window.addEventListener('scroll', this.scroll, true);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    }

    scroll = (): void => {
        this.measureDistance();
    };

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
    }
}
