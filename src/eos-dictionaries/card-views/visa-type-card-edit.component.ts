import { Component, Injector, OnInit } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { NOT_EMPTY_STRING } from 'eos-dictionaries/consts/input-validation';

@Component({
    selector: 'eos-visa-type-card-edit',
    templateUrl: 'visa-type-card-edit.component.html',
})
export class VisaTypeEditComponent extends BaseCardEditComponent {
    readonly notEmptyString = NOT_EMPTY_STRING;
    constructor(injector: Injector) {
        super(injector);
    }

    public changeFinaly(val: boolean) {
        this.data.rec['IS_FINAL'] = (val) ? 1 : 0;
        this.onChange.emit(true);
    }

    public changed() {
        this.onChange.emit(true);
    }
}
