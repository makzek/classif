import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { InputBase } from './input-base';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';

@Injectable()
export class InputControlService {
    constructor(private _dictSrv: EosDictService) { }

    toFormGroup(inputs: InputBase<any>[]) {
        const group: any = {};

        Object.keys(inputs).forEach(input => {
            group[inputs[input].key] = inputs[input].required ?
                new FormControl(inputs[input].value || '', [
                    Validators.required,
                    Validators.pattern(inputs[input].pattern),
                    this.unicValueValidator(inputs[input].isUnic, inputs[input].key, inputs[input].unicInDict)
                ])
                : new FormControl(inputs[input].value || '', [
                    Validators.pattern(inputs[input].pattern),
                    this.unicValueValidator(inputs[input].isUnic, inputs[input].key, inputs[input].unicInDict)
                ]);
        });
        return new FormGroup(group);
    }

    unicValueValidator(isUnic: boolean, key: string, inDict: boolean): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isUnic) {
                return this.checkUnic(control.value, key, inDict) ? { 'isUnic': false } : null;
            } else {
                return null;
            }
        }
    }

    checkUnic(val: any, key: string, inDict?: boolean) {
        return this._dictSrv.isUnic(val, key, inDict);
    }
}
