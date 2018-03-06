import { InputBase } from './input-base';

export class DateInput extends InputBase<string> {
    controlType = 'date';
    // type: Date;

    constructor(options: {} = {}) {
        super(options);
        // this.type = options['type'] || 'text';
        this.pattern = /.*(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19\d{2}|20\d{2}|2100).*?/;
    }
}
