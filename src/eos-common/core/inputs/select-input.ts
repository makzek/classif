import { InputBase } from './input-base';
import { ISelectOption, ISelectInput } from '../../interfaces';

export class DropdownInput extends InputBase<string> implements ISelectInput {
    controlType = 'select';
    options: ISelectOption[] = [];

    constructor(options: ISelectInput) {
        super(options);
        this.options = options['options'] || [];
    }
}
