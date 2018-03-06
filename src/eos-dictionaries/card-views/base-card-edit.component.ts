import { Output, Input, EventEmitter, OnChanges, OnDestroy, ViewChild, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';

import { Subscription } from 'rxjs/Subscription';
import { EosUtils } from 'eos-common/core/utils';

export class BaseCardEditComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() nodeId: string;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];

    @ViewChild('cardForm') cardForm: NgForm;

    tooltipText = '';
    focusedField: string;
    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

    protected dictSrv: EosDictService;

    private _subscrChanges: Subscription;

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
    }

    ngOnChanges() {
        setTimeout(() => {
            if (this.cardForm) {
                if (this._subscrChanges) {
                    this._subscrChanges.unsubscribe();
                    this._subscrChanges = null;
                }
                this._subscrChanges = this.cardForm.control.valueChanges.subscribe(() => {
                    this.invalid.emit(this.cardForm.invalid);
                });
            }
        }, 0);
    }

    ngOnDestroy() {
        if (this._subscrChanges) {
            this._subscrChanges.unsubscribe();
        }
    }

    /**
     * Updates value in record data
     * @param fldKey property name
     * @param dict dictionary name
     * @param value value
     * @deprecated use changeByPath instead
     */
    change(fldKey: string, dict: string, value: any) {
        const path = dict + '.' + fldKey;
        this.changeByPath(path, value);
    }

    /**
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

        if (EosUtils.getValueByPath(this.data, path) !== _value) {
            EosUtils.setValueByPath(this.data, path, _value);
            this.onChange.emit(this.data);
        }
    }

    focus(name: string) {
        this.focusedField = name;
    }

    blur() {
        this.focusedField = null;
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/

    checkUnic(val: any, key: string, inDict?: boolean) {
        if (this.focusedField === key) {
            return this.dictSrv.isUnic(val, key, inDict, this.nodeId);
        } else {
            return null;
        }
    }

    isInvalid(fieldName: string): boolean {
        if (this.cardForm) {
            const control = this.cardForm.controls[fieldName];
            return control && control.dirty && control.invalid && this.focusedField !== fieldName;
        }
    }
}
