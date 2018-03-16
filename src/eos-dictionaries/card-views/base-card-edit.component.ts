import { Output, Input, EventEmitter, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EosDictService } from '../services/eos-dict.service';
import { EosUtils } from 'eos-common/core/utils';

export class BaseCardEditComponent {
    @Input() form: FormGroup;
    @Input() inputs: any;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    // inputs: any;
    // newData: any;
    // form: FormGroup;
    nodeId: string;

    protected dictSrv: EosDictService;

    /* private _dates: any = {}; */
    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
    }


    /**
     * @deprecated implementation moved to CardEditComponent
     * Updates value in record data
     * @param path - path in data to property
     * @param value - new value
     */
    changeByPath(path: string, value: any) {
        let _value = null;

        if (typeof value === 'string') {
            value = value.trim();
        }

        if (typeof value === 'boolean') {
            _value = +value;
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else if (value === '') { // fix empty strings in IE
            _value = null;
        } else {
            _value = value;
        }
        // const oldValue = EosUtils.getValueByPath(this.data, path);
        // EosUtils.setValueByPath(this.newData, path, _value);
        return EosUtils.getValueByPath(this.data, path) !== _value;
    }

    /**
     * make string[] from object keys
     * @param data object which keys is used
     */
    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
    }

    protected getValue(path: string): any {
        const control = this.form.controls[path];
        if (control) {
            return control.value;
        } else {
            return null;
        }
    }

    protected setValue(path: string, value: any) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value);
        }
    }
    /* move into dynamic input
    isInvalid(fieldName: string): boolean {
        if (this.cardForm) {
            const control = this.cardForm.controls[fieldName];
            // console.log(control, fieldName);
            return control && control.dirty && control.invalid && this.focusedField !== fieldName;
        }
    }

    dateValid(fldName: string, valid: boolean) {
        this._dates[fldName] = valid;
        this.isFormValid();
    }

    private isFormValid() {
        if (this.cardForm) {
            setTimeout(() => {
                const datesInvalid = Object.keys(this._dates).length ?
                    Object.keys(this._dates).findIndex((fld) => !this._dates[fld]) > -1 : false;
                const invalid = this.cardForm.invalid || datesInvalid;
                this.formInvalid.emit(invalid);
            }, 0);
        }
    }
    */
}
