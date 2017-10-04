import { Component, Input, Output, EventEmitter } from '@angular/core';

import 'moment/locale/ru';
import * as moment from 'moment';

@Component({
    selector: 'eos-datepicker',
    templateUrl: 'datepicker.component.html',
})
export class DatepickerComponent {
    @Input() value = Date();
    @Input() readonly = false;
    @Input() placeholder = '';
    @Output() change: EventEmitter<Date> = new EventEmitter<Date>();

    hideCalendar = true;

    constructor() {
        moment.locale('ru');
    }

    changeState() {
        if (!this.readonly) {
            this.hideCalendar = !this.hideCalendar;
        }
    }

    updateValue(evt: Date) {
        this.change.emit(evt);
        this.hideCalendar = true;
    }
}
