import { Component, Output, Input, EventEmitter, OnChanges, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { EosDataConvertService } from '../services/eos-data-convert.service';
import { InputControlService } from '../../eos-common/services/input-control.service';

export class BaseCardEditComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    form: FormGroup;

    protected dictSrv;
    private _dataSrv;
    private _inputCtrlSrv;

    private _currentFormStatus;

    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

    inputs: any;
    newData: any;

    private _validationSubscr: Subscription;
    private _changeSubscr: Subscription;

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this._dataSrv = injector.get(EosDataConvertService);
        this._inputCtrlSrv = injector.get(InputControlService);
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

    /**
     * generates inputs object, construct form,
     * subscribe on statusChanges and valueChanges
     */
    ngOnChanges() {
        if (this.fieldsDescription && this.data) {
            this.inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data);

            if (this.data.rec && this.data.rec.IS_NODE) {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
            } else {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            }

            if (this._validationSubscr) {
                this._validationSubscr.unsubscribe();
            }
            this._validationSubscr = this.form.statusChanges.subscribe((status) => {
                if (this._currentFormStatus !== status) {
                    this.invalid.emit(status === 'INVALID');
                }
                this._currentFormStatus = status;
            });

            if (this._changeSubscr) {
                this._changeSubscr.unsubscribe();
            }
            this._changeSubscr = this.form.valueChanges.subscribe((newVal) => {
                this.newData = this._makeSavingData(this.form.value);
                this.onChange.emit(this._notEqual(this.newData, this.data));
            });
        }
    }

    /**
     * unsubscribe
     */
    ngOnDestroy() {
        if (this._validationSubscr) {
            this._validationSubscr.unsubscribe();
        }
        if (this._changeSubscr) {
            this._changeSubscr.unsubscribe();
        }
    }

    /**
     * convert form data in object suitable for saving
     * @param formData form data which is converted
     */
    private _makeSavingData(formData: any): any {
        const result = {};
        if (formData) {
            Object.keys(formData).forEach((_ctrl) => {
                const _way = _ctrl.split('.');
                if (!result[_way[0]]) {
                    result[_way[0]] = {};
                }
                if (_way[2] === 'boolean') {
                    result[_way[0]][_way[1]] = formData[_ctrl] ? 1 : 0;
                } else {
                    result[_way[0]][_way[1]] = formData[_ctrl];
                }
            });
        }
        return result;
    }

    /**
     * compare two objects
     * @param newObj one object
     * @param oldObj other object
     */
    private _notEqual(newObj: any, oldObj: any): boolean {
        if (newObj) {
            return Object.keys(newObj).findIndex((_dict) =>
                Object.keys(newObj[_dict]).findIndex((_key) =>
                    ((newObj[_dict][_key] || oldObj[_dict][_key]) && newObj[_dict][_key] !== oldObj[_dict][_key])) > -1
            ) > -1;
        } else {
            return false;
        }
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/

    /**
     * return new data, used by parent component
     */
    getNewData(): any {
        return this.newData;
    }
}
