import { Component, Output, Input, EventEmitter, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictService } from '../services/eos-dict.service';

import { Subscription } from 'rxjs/Subscription';

export class BaseCardEditComponent implements OnInit, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() nodeSet: EosDictionaryNode[];
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardForm') cardForm: NgForm;
    private _subscrChanges: Subscription;

    tooltipText = '';
    focusedField: string;

    protected dictSrv;

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
    }

    keys(data: Object): string[] {
        return Object.keys(data);
    }

    ngOnInit() {
        if (this.cardForm) {
            this.cardForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(!this.cardForm.valid);
            });
        }
    }

    ngOnDestroy() {
        if (this._subscrChanges) {
            this._subscrChanges.unsubscribe();
        }
    }

    change(fldKey: string, value: string) {
        this.data[fldKey] = value;
        this.onChange.emit(this.data);
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
        return this.dictSrv.isUnic(val, key, inDict);
    }
}
