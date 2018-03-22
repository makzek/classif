import { Component, Output, Input, EventEmitter, ViewChild, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { EosUtils } from 'eos-common/core/utils';
// import { EosDictService } from '../services/eos-dict.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from '../services/eos-data-convert.service';
// import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent implements OnChanges, OnDestroy {
    @Input() dictionaryId: string;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardEditEl') baseCardEditRef: BaseCardEditComponent;

    form: FormGroup;
    inputs: any;
    newData: any = {};

    private _currentFormStatus;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _dataSrv: EosDataConvertService,
        // private dictSrv: EosDictService,
        private _inputCtrlSrv: InputControlService
    ) {
        // console.log(this.dictSrv.currentDictionary);
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
        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        const oldValue = EosUtils.getValueByPath(this.data, path);
        if (oldValue !== _value) {
            console.warn('changed', path, oldValue, 'to', _value);
        }
        return _value !== oldValue;
    }

    /**
     * return new data, used by parent component
     */
    getNewData(): any {
        return this.newData;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.fieldsDescription || changes.data) && this.fieldsDescription && this.data) {
            const inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data, this.editMode);
            const isNode = this.data.rec && this.data.rec.IS_NODE;
            this.form = this._inputCtrlSrv.toFormGroup(inputs, isNode);
            this.inputs = inputs;
            this.form.valueChanges
                .takeUntil(this.ngUnsubscribe)
                .subscribe((newVal) => {
                    let changed = false;
                    Object.keys(newVal).forEach((path) => {
                        if (this.changeByPath(path, newVal[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                });

            this.form.statusChanges
                .takeUntil(this.ngUnsubscribe)
                .subscribe((status) => {
                    if (this._currentFormStatus !== status) {
                        this.formInvalid.emit(status === 'INVALID');
                    }
                    this._currentFormStatus = status;
                });
        }
    }

    /**
     * unsubscribe on destroy
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    recordChanged(data: any) {
        this.formChanged.emit(data);
    }

    recordInvalid(data: any) {
        this.formInvalid.emit(data);
    }
}
