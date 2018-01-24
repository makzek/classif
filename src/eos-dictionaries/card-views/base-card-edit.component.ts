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

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
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

    change(fldKey: string, dict: string, value: any) {
        let _value = null;
        if (typeof value === 'boolean') {
            _value = +value;
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else {
            _value = value;
        }

        if (this.data[dict][fldKey] !== _value) {
            this.data[dict][fldKey] = _value;
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
}
