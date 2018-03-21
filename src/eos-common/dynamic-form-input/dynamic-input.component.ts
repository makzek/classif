import { Component, Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'eos-dynamic-input',
    templateUrl: 'dynamic-input.component.html'
})
export class DynamicInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
}
