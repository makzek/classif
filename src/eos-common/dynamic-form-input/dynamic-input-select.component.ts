import { Component } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-select',
    templateUrl: 'dynamic-input-select.component.html'
})
export class DynamicInputSelectComponent extends DynamicInputBase {
    selectClick(evt: Event) {
        if (this.readonly) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    currentValue(): string {
        let value = this.input.label;
        const ctrl = this.form.controls[this.input.key];
        console.log('form control', ctrl);
        console.log('value', ctrl.value);
        console.log('options', this.input.options)
        if (ctrl) {
            const optValue = this.input.options.find((option) => option.value === ctrl.value);
            if (optValue) {
                value = optValue.title;
            }
        }
        return value;
    }

    hasValue(): boolean {
        const ctrl = this.form.controls[this.input.key];
        return (ctrl && ctrl.value !== null && ctrl.value !== undefined);
    }
}
