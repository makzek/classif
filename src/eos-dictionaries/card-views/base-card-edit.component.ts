import { Component, Output, Input, EventEmitter, OnChanges, ViewChild, Injector } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { DataConvertService } from '../../eos-common/text-input/data-convert.service';
import { InputControlService } from '../../eos-common/text-input/input-control.service';

export class BaseCardEditComponent implements OnChanges {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() nodeId: string;
    @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    // @ViewChild('cardForm') cardForm: NgForm;
    form: FormGroup;
    tooltipText = '';
    focusedField: string;

    protected dictSrv;
    private _dataSrv;
    private _inputCtrlSrv;

    private currentFormStatus;

    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

    inputs: any[];

    newData: any;

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this._dataSrv = injector.get(DataConvertService);
        this._inputCtrlSrv = injector.get(InputControlService);
    }

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
    }

    ngOnChanges() {
        if (this.fieldsDescription) {
            /*this.form = new FormGroup({});
            Object.keys(this.fieldsDescription).forEach((_dict) => {
                switch (_dict) {
                    case 'rec':
                        Object.keys(this.fieldsDescription[_dict]).forEach((_key) => {
                            this.form.controls[_key] = new FormControl();
                        });
                        break;
                    case 'sev':
                        this.form.controls['sev'] = new FormControl();
                        break;
                }
            });*/
            // this.newData = this.data;
            this.inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            this.form.statusChanges.subscribe((status) => {
                if (this.currentFormStatus !== status) {
                    this.invalid.emit(status === 'INVALID');
                }
                this.currentFormStatus = status;
            });
            this.form.valueChanges.subscribe((newVal) => {
                this.newData = this._makeSavingData(this.form.value);
                console.log('_notEqual', this._notEqual(this.newData, this.data));
                this.onChange.emit(this._notEqual(this.newData, this.data));
            });
        }
    }

    private _makeSavingData(formData: any): any {
        const result = {};
        if (formData) {
            Object.keys(formData).forEach((_ctrl) => {
                const _way = _ctrl.split('.');
                if (!result[_way[0]]) {
                    result[_way[0]] = {};
                }
                result[_way[0]][_way[1]] = formData[_ctrl];
            });
        }
        return result;
    }

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

    focus(name: string) {
        this.focusedField = name;
    }

    blur() {
        this.focusedField = null;
    }

    change(data: any) {
        // this.onChange.emit(data);
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

    getNewData(): any {
        return this.newData;
    }
}
