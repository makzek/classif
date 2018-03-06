import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { InputBase } from '../core/inputs/input-base';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { IBaseInput, ISelectInput } from '../interfaces';
import { StringInput } from '../core/inputs/string-input';
import { TextInput } from '../core/inputs/text-input';
import { CheckboxInput } from '../core/inputs/checkbox-input';
import { DateInput } from '../core/inputs/date-input';
import { DropdownInput } from '../core/inputs/select-input';

@Injectable()
export class InputControlService {
    constructor(private _dictSrv: EosDictService) { }

    generateInputs(inputs: IBaseInput[]): InputBase<any>[] {
        const set: InputBase<any>[] = [];
        inputs.forEach((input) => {
            switch (input.controlType) {
                case 'text':
                    set.push(new TextInput(input));
                    break;
                case 'checkbox':
                    set.push(new CheckboxInput(input));
                    break;
                case 'date':
                    set.push(new DateInput(input));
                    break;
                case 'select':
                    set.push(new DropdownInput(<ISelectInput>input));
                    break;
                default:
                    set.push(new StringInput(input));
                    break;
            }
        });
        return set;
    }

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
     * @param path path in data object
     * @param inDict must it be unic in dictionary
     */
    unicValueValidator(path: string, inDict: boolean): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => this._dictSrv.isUnic(control.value, path, inDict);
    }

    /**
     * add input to group
     * @param group data for FormGroup
     * @param input input which is added to group
     */
    private _addInput(group: any, input: InputBase<any>) {
        const value = input.value !== undefined ? input.value : null;
        const validators = [];
        if (input.pattern) {
            validators.push(Validators.pattern(input.pattern));
        }
        if (input.isUnic) {
            validators.push(this.unicValueValidator(input.key, input.unicInDict));
        }
        if (input.required) {
            validators.push(Validators.required);
        }
        if (input.disabled) {
            group[input.key] = new FormControl({ value: value, disabled: true }, validators);
        } else {
            group[input.key] = new FormControl(value, validators);
        }
    }
}
