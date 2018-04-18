import { Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';

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

    tooltipMessage = '';

    get control(): AbstractControl {
        return this.form.controls[this.input.key];
    }

    get isValid() {
        return this.control.valid;
    }

    get isDirty() {
        return this.control.dirty;
    }

    get isRequired(): boolean {
        let required = false;
        const control = this.control;
        if (control && control.errors) {
            required = !!this.control.errors['required'];
        }
        return required;
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this.updateMessage();
    }

    private updateMessage() {
        let msg = '';
        const control = this.control;
        if (this.control && this.control.errors) {
            msg = Object.keys(control.errors)
                .map((key) => {
                    switch (key) {
                        case 'wrongDate':
                        case 'pattern':
                        case 'required':
                            return INPUT_ERROR_MESSAGES[key];
                        case 'isUnic':
                            return INPUT_ERROR_MESSAGES[key][+(!!this.input.unicInDict)];
                        case 'maxlength':
                            return 'Максимальная длина ' + this.input.length + ' символ(а|ов).';
                        default:
                            // console.warn('unhandled error key', key);
                            return INPUT_ERROR_MESSAGES.default;
                    }
                })
                .join(' ');
        } else {
            this.tooltipCfg.class = 'tooltip-info';
        }
        this.tooltipMessage = msg;
    }
}
