import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-text-input',
    templateUrl: 'text-input.component.html'
})
export class TextInputComponent {
    @Input() readonly = false;
    @Input() data: any;
    @Input() placeholder: string;
    @Input() required: boolean;
    @Input() pattern: boolean;
    @Input() maxlength: boolean;
    @Input() eosUnic: boolean;
    @Input() key: boolean;
    @Input() checkingMethod: boolean;
    @Input() inDict: boolean;
    @Input() tooltipMessage: string;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('inputEl') inputEl;

    checkUnic() {}

    focus() {
        console.log('inputEl', this.inputEl);
    }

    blur() {}

    onChange() {
        this.change.emit(this.inputEl.nativeElement.value);
    }
}
