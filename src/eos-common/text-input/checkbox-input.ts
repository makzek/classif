import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { InputBase } from './input-base';

export class CheckboxInput extends InputBase<string> {
    controlType = 'checkbox';

    constructor(options: {} = {}) {
        super(options);
    }
}
