import { Component, Output, Input, EventEmitter, OnChanges, OnDestroy, ViewChild, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';

import { Subscription } from 'rxjs/Subscription';

export class BaseCardEditComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() nodeId: string;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardForm') cardForm: NgForm;
    private _subscrChanges: Subscription;

    tooltipText = '';
    focusedField: string;

    protected dictSrv;

    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

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
                this._subscrChanges = this.cardForm.control.valueChanges.subscribe(() => {
                    console.log('emit invalid = ', this.cardForm.invalid);
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
        if (typeof value === 'boolean') {
            value = +value;
        }
        if (this.data[dict][fldKey] !== value) {
            this.data[dict][fldKey] = value;
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
