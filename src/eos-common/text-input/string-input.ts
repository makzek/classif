import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { InputBase } from './input-base';

export class StringInput extends InputBase<string> {
  controlType = 'string';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
