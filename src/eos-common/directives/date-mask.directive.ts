import { Directive, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[ngModel][eos-date-mask]',
})
export class EosDateMaskDirective {
    constructor(private model: NgModel) { }

    @HostListener('ngModelChange')
    onModelChange(value: any) {
        console.log(this.model);
        console.log(value);
    }

    @HostListener('keydown.backspace')
    onBSpace(evt: Event) {
        console.log(this.model);
        console.log(evt);
    }

    /*
    host: {
        '(ngModelChange)': 'onInputChange($event)',
        '(keydown.backspace)': 'onInputChange($event.target.value, true)'
    }
    */
    onInputChange(event, backspace) {
        // remove all mask characters (keep only numeric)
        let newVal = event.replace(/\D/g, '');
        // special handling of backspace necessary otherwise
        // deleting of non-numeric characters is not recognized
        // this laves room for improvement for example if you delete in the
        // middle of the string
        if (backspace) {
            newVal = newVal.substring(0, newVal.length - 1);
        }

        // don't show braces for empty value
        if (newVal.length === 0) {
            newVal = '';
        } else if (newVal.length <= 3) {  // don't show braces for empty groups at the end
            newVal = newVal.replace(/^(\d{0,3})/, '($1)');
        } else if (newVal.length <= 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
        } else {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) ($2)-$3');
        }
        // set the new value
        // this.model.valueAccessor.writeValue(newVal);
    }
}
