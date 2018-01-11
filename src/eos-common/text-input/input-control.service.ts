import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { InputBase } from './input-base';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';

@Injectable()
export class InputControlService {
    nodeId: string;
    constructor(private _dictSrv: EosDictService) { }

    toFormGroup(inputs: InputBase<any>[]) {
        const group: any = {};

        inputs.forEach(input => {
            group[input.key] = input.required ?
                new FormControl(input.value || '', [
                    Validators.required,
                    Validators.pattern(input.pattern),
                    this.unicValueValidator(input.isUnic, input.key, input.unicInDict)
                ])
                : new FormControl(input.value || '', [
                    Validators.pattern(input.pattern),
                    this.unicValueValidator(input.isUnic, input.key, input.unicInDict)
                ]);
            /*group[input.key] = input.required ? new FormControl('', [Validators.required, Validators.pattern(input.pattern)])
                                              : new FormControl('', Validators.pattern(input.pattern));*/
        });
        return new FormGroup(group);
    }

    initNodeId(nodeId: string) {
        this.nodeId = nodeId;
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
        return this._dictSrv.isUnic(val, key, inDict, this.nodeId);
    }
}
