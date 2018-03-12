import { Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup } from '@angular/forms';

export class DynamicInputBase {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;

    focused = false;

    tooltipCfg: any = {
        placement: 'bottom',
        class: 'tooltip-error',
        container: ''
    };

    get isValid() {
        return this.form.controls[this.input.key].valid;
    }

    get isDirty() {
        return this.form.controls[this.input.key].dirty;
    }


    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
    }
}
