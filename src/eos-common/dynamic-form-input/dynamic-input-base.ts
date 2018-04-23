import { Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup, AbstractControl } from '@angular/forms';
import { INPUT_ERROR_MESSAGES } from '../consts/common.consts';

export class DynamicInputBase {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() inputTooltip: any;

    get isRequired(): boolean {
        let required = false;
        const control = this.control;
        if (control && control.errors) {
            required = !!this.control.errors['required'];
        }
        return required;
    }

    protected get control(): AbstractControl {
        return this.form.controls[this.input.key];
    }

    onFocus() {
        this.toggleTooltip(true);
    }

    onBlur() {
        this.updateMessage();
        this.toggleTooltip(false);
    }

    private updateMessage() {
        let msg = '';
        const control = this.control;
        if (this.control && this.control.errors) {
            // this.inputTooltip.class = 'tooltip-error';
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
                        case 'dateCompare':
                            return control.errors[key];
                        default:
                            // console.warn('unhandled error key', key);
                            return INPUT_ERROR_MESSAGES.default;
                    }
                })
                .join(' ');
        } else {
            // this.inputTooltip.class = 'tooltip-info';
        }
        this.inputTooltip.message = msg;
    }

    private toggleTooltip(focused: boolean) {
        if (!this.readonly) {
            const control = this.control;
            if (control) {
                this.inputTooltip.visible = !focused && control.invalid && control.dirty;
            } else {
                this.inputTooltip.visible = false;
            }
        }
    }
}
