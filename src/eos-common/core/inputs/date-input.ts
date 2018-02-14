import { InputBase } from './input-base';

export class DateInput extends InputBase<string> {
    controlType = 'date';
    type: Date;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}