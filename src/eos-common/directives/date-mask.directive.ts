import { Directive, /* HostListener, ElementRef, */ forwardRef, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DATE_INPUT_PATERN, DATE_JSON_PATTERN } from '../consts/common.consts';
import { EosUtils } from '../core/utils';

@Directive({
    selector: '[eosDateMask]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EosDateMaskDirective),
            multi: true
        }
    ]
})
export class EosDateMaskDirective implements ControlValueAccessor {
    private dateValue: Date;

    get value() {
        return this.dateValue;
    }

    set value(val) {
        this.dateValue = val;
        this.onChange(this.dateValue);
        this.onTouched();
    }


    constructor(private ref: ElementRef) { }


    onChange: any = () => { };
    onTouched: any = () => { };

    @HostListener('click', [])
    @HostListener('focus', [])
    onFocus() {
        const elem = this.ref.nativeElement;
        const cursorPos = (elem.selectionStart < 10) ? elem.selectionStart : 9;
        elem.selectionStart = cursorPos;
        elem.selectionEnd = cursorPos + 1;
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(kbEvt: KeyboardEvent) {
        const elem = this.ref.nativeElement;
        const cursorPos = elem.selectionStart;
        const oldVal = elem.value;
        // if (elem.value) {
            const parts = oldVal.split('.');
            const valParts = '..'.split('.')
                .map((subVal, idx) => parts[idx] ? parts[idx].replace(/\D/g, '') : '')
                .map((subNum, idx) => (subNum + '____').substr(0, idx < 2 ? 2 : 4));

            const val = valParts.join('.');
            if (val.replace(/\D/g, '')) {
                this.ref.nativeElement.value = val;
            } else {
                this.ref.nativeElement.value = null;
            }

            switch (kbEvt.keyCode) {
                case 8: // backspace
                case 37: // left
                    if (cursorPos === 3 || cursorPos === 6) {
                        elem.selectionStart = cursorPos - 2;
                    } else {
                        elem.selectionStart = cursorPos - 1;
                    }
                    elem.selectionEnd = elem.selectionStart + 1;
                    break;
                case 38: // up
                    elem.selectionStart = 0;
                    elem.selectionEnd = 1;
                    break;
                case 40: // down
                    elem.selectionStart = 9;
                    elem.selectionEnd = 10;
                    break;
                case 39: // right
                default:
                    if (cursorPos === 2 || cursorPos === 5) {
                        elem.selectionStart = cursorPos + 1;
                    } else {
                        elem.selectionStart = cursorPos;
                    }
                    elem.selectionEnd = elem.selectionStart + 1;
                    break;
                /*
                    const selStart = val.indexOf('_');
                    if (selStart > -1) {
                        elem.selectionStart = selStart;
                        if (selStart > -1 && selStart < 3) {
                            elem.selectionEnd = 2;
                        } else if (selStart >= 3 && selStart < 5) {
                            elem.selectionEnd = 5;
                        } else {
                            elem.selectionEnd = 10;
                        }
                    }
                */
            }
        // }
        this.value = this.parseDate(this.ref.nativeElement.value);
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        if (value) {
            if (value instanceof Date) {
                value.setHours(0, 0, 0, 0);
            }
            this.value = value;
            this.ref.nativeElement.value = EosUtils.dateToStringValue(value);
        }
    }

    private parseDate(value: string): Date {
        value = (value && 'string' === typeof value) ? value.trim() : value;
        if (value) {
            if (DATE_INPUT_PATERN.test(value)) { // if correct format
                // convert to UTC format then to Date
                this.dateValue = new Date(value.replace(DATE_INPUT_PATERN, '$3-$2-$1T00:00:00.000Z'));
            } else if (DATE_JSON_PATTERN.test(value)) {
                this.dateValue = new Date(value);
            } else {
                this.dateValue = new Date('incorrect date');
            }
        } else {
            this.dateValue = null;
        }
        return this.dateValue;
    }

}
