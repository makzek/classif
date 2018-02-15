import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { InputBase } from '../core/inputs/input-base';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';

@Injectable()
export class InputControlService {
    constructor(private _dictSrv: EosDictService) { }

    /**
     * make FormGroup from array of InputBase<any>
     * @param inputs input which added to form
     * @param isNode flag for node
     */
    toFormGroup(inputs: InputBase<any>[], isNode?: boolean) {
        const group: any = {};

        Object.keys(inputs).forEach(input => {
            if (inputs[input].forNode) {
                if (isNode) {
                    this._addInput(group, inputs[input]);
                }
            } else {
                this._addInput(group, inputs[input]);
            }
        });
        return new FormGroup(group);
    }

    /**
     * custom validation function
     * check if value is unic
     * @param isUnic show if value must be unic
     * @param key key of checked value
     * @param inDict must it be unic in dictionary
     */
    unicValueValidator(isUnic: boolean, key: string, inDict: boolean): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isUnic) {
                return this._dictSrv.isUnic(control.value, key, inDict) ? { 'isUnic': false } : null;
            } else {
                return null;
            }
        };
    }

    /**
     * add input to group
     * @param group data for FormGroup
     * @param input input which is added to group
     */
    private _addInput(group: any, input: InputBase<any>) {
        const value = input.value !== undefined ? input.value : null;
        group[input.key] = input.required ?
            new FormControl(value, [
                Validators.required,
                Validators.pattern(input.pattern),
                this.unicValueValidator(input.isUnic, input.key, input.unicInDict)
            ])
            : new FormControl(value, [
                Validators.pattern(input.pattern),
                this.unicValueValidator(input.isUnic, input.key, input.unicInDict)
            ]);
    }
}
