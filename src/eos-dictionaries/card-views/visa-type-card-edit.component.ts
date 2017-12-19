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
        if (val) {
            this.data.rec['IS_FINAL'] = 1;
        } else {
            this.data.rec['IS_FINAL'] = 0;
        }
        this.onChange.emit(true);
    }

    public changed() {
        this.onChange.emit(true);
    }
}
