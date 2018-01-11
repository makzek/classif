import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputBase } from './input-base';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'eos-dynamic-form-input',
    templateUrl: 'dynamic-form-input.component.html'
})
export class DynamicFormInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() data: any;

    get isValid() {
        return this.form.controls[this.input.key].valid;
    }

    get isDirty() {
        return this.form.controls[this.input.key].dirty;
    }
}
