import { InputBase } from './input-base';

export class DateInput extends InputBase<Date> {
    controlType = 'date';
    value: Date;
    // type: Date;

    constructor(options: {} = {}) {
        super(options);
        if (options['value']) {
            if (options['value'] instanceof Date) {
                this.value = options['value'];
            } else {
                this.value = new Date(options['value']);
            }
        }
        this.pattern = null;
        // this.type = options['type'] || 'text';
    }
}
