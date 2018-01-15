import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { InputBase } from './input-base';

export class CheckboxInput extends InputBase<number> {
    controlType = 'checkbox';

    constructor(options: {} = {}) {
        super(options);
        if (!this.value) {
            this.value = 0;
        }
    }
}
