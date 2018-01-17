import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { NOT_EMPTY_STRING } from '../consts/input-validation';

@Component({
    selector: 'eos-security-card-edit',
    templateUrl: 'security-card-edit.component.html',
})
export class SecurityCardEditComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
