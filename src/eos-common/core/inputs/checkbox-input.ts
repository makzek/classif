import { InputBase } from './input-base';

export class CheckboxInput extends InputBase<boolean> {
    controlType = 'checkbox';
    disabled: boolean;

    constructor(options: {} = {}) {
        super(options);
        this.value = !!this.value;
    }
}
