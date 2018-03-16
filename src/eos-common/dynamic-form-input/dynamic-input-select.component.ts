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

    hasValue(): boolean {
        const ctrl = this.form.controls[this.input.key];
        return (ctrl.value !== null && ctrl.value !== undefined);
    }
}
