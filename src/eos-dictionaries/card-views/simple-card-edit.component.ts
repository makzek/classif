import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { NOT_EMPTY_STRING } from 'eos-dictionaries/consts/input-validation';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})
export class SimpleCardEditComponent extends BaseCardEditComponent {
    readonly notEmptyString = NOT_EMPTY_STRING;

    payLoad = '';

    constructor(injector: Injector) {
        super(injector);
    }
}
