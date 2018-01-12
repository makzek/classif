import { InputBase } from './input-base';

export class DropdownInput extends InputBase<string> {
  controlType = 'select';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    console.log('options', options);
    this.options = options['options'] || [];
  }
}
