import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { ru } from 'ngx-bootstrap/locale';
defineLocale('ru', ru);

@Component({
    selector: 'eos-datepicker',
    templateUrl: 'datepicker.component.html',
})
export class DatepickerComponent {
    @Input() value = Date();
    @Input() readonly = false;
    @Input() placeholder = '';
    @Input() placement = 'bottom';
    @Output() change: EventEmitter<Date> = new EventEmitter<Date>();
    bsConfig: Partial<BsDatepickerConfig>;

    constructor() {
        this.bsConfig = {
            locale: 'ru',
            showWeekNumbers: false,
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD.MM.YYYY',
            isDisabled: true,
        };
    }

    emitChange(date: Date) {
        this.change.emit(date);
    }
}
