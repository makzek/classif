import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { InputBase } from './input-base';

export class TextInput extends InputBase<string> {
  controlType = 'text';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
