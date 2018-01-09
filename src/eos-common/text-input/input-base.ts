export class InputBase<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  pattern: RegExp;
  readonly: boolean;
  isUnic: boolean;
  invalidMessage: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    pattern?: RegExp,
    readonly?: boolean,
    isUnic?: boolean,
    invalidMessage?: string,
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.pattern = options.pattern || null;
    this.readonly = !!options.readonly;
    this.isUnic = !!options.isUnic;
    this.invalidMessage = options.invalidMessage || '';
  }
}
