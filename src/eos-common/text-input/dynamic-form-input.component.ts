import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputBase } from '../core/inputs/input-base';

@Component({
    selector: 'eos-dynamic-form-input',
    templateUrl: 'dynamic-form-input.component.html'
})
export class DynamicFormInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;

    get isValid() {
        return this.form.controls[this.input.key].valid;
    }

    get isDirty() {
        return this.form.controls[this.input.key].dirty;
    }
}
