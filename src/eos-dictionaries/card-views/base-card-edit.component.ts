import { Component, Output, Input, EventEmitter, OnChanges, OnDestroy, ViewChild, Injector } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { DataConvertService } from '../../eos-common/text-input/data-convert.service';

import { Subscription } from 'rxjs/Subscription';

export class BaseCardEditComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() nodeId: string;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    // @ViewChild('cardForm') cardForm: NgForm;
    form: FormGroup;
    private _subscrChanges: Subscription;

    tooltipText = '';
    focusedField: string;

    protected dictSrv;
    protected dataSrv;

    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

    inputs: any[];

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this.dataSrv = injector.get(DataConvertService);
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
            /*if (this.cardForm) {
                this._subscrChanges = this.cardForm.control.valueChanges.subscribe(() => {
                    this.invalid.emit(this.cardForm.invalid);
                    this.onChange.emit(this.data);
                });
            }*/
        }, 0);
        this.form = new FormGroup({});
        if (this.fieldsDescription) {
            Object.keys(this.fieldsDescription).forEach((_dict) => {
                Object.keys(this.fieldsDescription[_dict]).forEach((_key) => {
                    this.form.controls[_key] =  new FormControl();
                });
            });
        }
        this.inputs = this.dataSrv.getInputs(this.fieldsDescription);
        console.log('this.inputs', this.inputs);
    }

    ngOnDestroy() {
        if (this._subscrChanges) {
            this._subscrChanges.unsubscribe();
        }
    }

    focus(name: string) {
        this.focusedField = name;
    }

    blur() {
        this.focusedField = null;
    }

    change(data: any) {
        this.onChange.emit(data);
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
