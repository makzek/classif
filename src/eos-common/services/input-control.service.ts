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
import { ButtonsInput } from '../core/inputs/buttons-input';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

@Injectable()
export class InputControlService {
    constructor(private _dictSrv: EosDictService) { }

    generateInputs(inputs: IBaseInput[]): InputBase<any>[] {
        const set: InputBase<any>[] = [];
        inputs.forEach((input) => {
            switch (E_FIELD_TYPE[input.controlType]) {
                case E_FIELD_TYPE.text:
                    set.push(new TextInput(input));
                    break;
                case E_FIELD_TYPE.boolean:
                    set.push(new CheckboxInput(input));
                    break;
                case E_FIELD_TYPE.date:
                    set.push(new DateInput(input));
                    break;
                case E_FIELD_TYPE.select:
                    set.push(new DropdownInput(<ISelectInput>input));
                    break;
                case E_FIELD_TYPE.buttons:
                    set.push(new ButtonsInput(<ISelectInput>input));
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
            if (inputs[input].forNode === undefined) {
                this._addInput(group, inputs[input]);
            } else if (inputs[input].forNode && isNode) {
                this._addInput(group, inputs[input]);
            } else if (inputs[input].forNode === false && !isNode) {
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

    dateValueValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            let valid = true;
            if (value && value instanceof Date) {
                valid = !isNaN(value.getTime());
            }
            return (valid ? null : { 'wrongDate': true });
        };
    }

    /**
     * add input to group
     * @param group data for FormGroup
     * @param input input which is added to group
     */
    private _addInput(group: any, input: InputBase<any>) {
        const value = input.value !== undefined ? input.value : null;
        const validators = [];

        if (input.disabled) {
            group[input.key] = new FormControl({ value: value, disabled: true }, validators);
        } else {
            if (input.controlType === E_FIELD_TYPE.date) {
                validators.push(this.dateValueValidator());
            }

            if (input.pattern) {
                validators.push(Validators.pattern(input.pattern));
            }
            if (input.isUnic) {
                validators.push(this.unicValueValidator(input.key, input.unicInDict));
            }
            if (input.required) {
                validators.push(Validators.required);
            }
            if (input.length) {
                validators.push(Validators.maxLength(input.length));
            }
            group[input.key] = new FormControl(value, validators);
        }
    }
}
