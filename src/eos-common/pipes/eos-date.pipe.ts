import { Pipe, PipeTransform } from '@angular/core';
import { EosUtils } from '../core/utils';

@Pipe({ name: 'eosDate' })
export class EosDatePipe implements PipeTransform {

    constructor() { }

    transform(value: Date | string): string {
        let date: Date;
        if (value instanceof Date) {
            date = value;
        } else if (value) {
            date = new Date(value);
        }

        if (date instanceof Date && !isNaN(date.getTime())) {
            return [EosUtils.pad(date.getDate()), EosUtils.pad(date.getMonth() + 1), date.getFullYear()].join('.');
        } else {
            return null;
        }
    }

    parse(value: string): string {
        return value;
    }
}
