import { InputBase } from './input-base';
import { ISelectOption } from '../../interfaces';

export class DropdownInput extends InputBase<string> {
    controlType = 'select';
    options: ISelectOption[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
    }
}
