import { Output, Input, EventEmitter, OnChanges, OnDestroy, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';

import { EosDictService } from '../services/eos-dict.service';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { EosDataConvertService } from '../services/eos-data-convert.service';
import { InputControlService } from '../../eos-common/services/input-control.service';
import { EosUtils } from 'eos-common/core/utils';

export class BaseCardEditComponent implements OnChanges, OnDestroy {
    @Input() form: FormGroup;
    @Input() inputs: any;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() onChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    // inputs: any;
    newData: any;
    // form: FormGroup;
    nodeId: string;
    readonly NOT_EMPTY_STRING = NOT_EMPTY_STRING;

    protected dictSrv: EosDictService;
    private _dataSrv;
    private _inputCtrlSrv;

    // private _currentFormStatus;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this._dataSrv = injector.get(EosDataConvertService);
        this._inputCtrlSrv = injector.get(InputControlService);
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

        EosUtils.setValueByPath(this.newData, path, _value);
        return EosUtils.getValueByPath(this.data, path) !== _value;
    }

    /*
    checkUnic(val: any, key: string, inDict?: boolean) {
        if (this.focusedField === key) {
            return this.dictSrv.isUnic(val, key, inDict, this.nodeId);
        } else {
            return null;
        }
    }
    */

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/

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
        /*
        if (this.fieldsDescription && this.data) {
            this.inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data);

            if (this.data.rec && this.data.rec.IS_NODE) {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
            } else {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            }
            console.log('form on change', this.form);
            this.form.valueChanges
                .takeUntil(this.ngUnsubscribe)
                .subscribe((newVal) => {
                    let changed = false;
                    Object.keys(newVal).forEach((path) => {
                        changed = this.changeByPath(path, newVal[path]);
                    });
                    console.log('new value', newVal);
                    // this.newData = this._makeSavingData(this.form.value);
                    this.onChange.emit(changed);
                });

            this.form.statusChanges
                .takeUntil(this.ngUnsubscribe)
                .subscribe((status) => {
                    if (this._currentFormStatus !== status) {
                        this.invalid.emit(status === 'INVALID');
                    }
                    this._currentFormStatus = status;
                });
            }
            */
    }

    /**
     * unsubscribe on destroy
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * convert form data in object suitable for saving
     * @param formData form data which is converted
     */
    /*
    private _makeSavingData(formData: any): any {
        const result = {};
        if (formData) {
            Object.keys(formData).forEach((_ctrl) => {
                console.log(_ctrl);
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
    */
    /**
     * compare two objects
     * @param newObj one object
     * @param oldObj other object
     */
    /*
    private _notEqual(newObj: any, oldObj: any): boolean {
        return this.dictSrv.isDataChanged(newObj, oldObj);
    }
    */
}
