import { Injectable } from '@angular/core';

import { StringInput } from './string-input';
import { TextInput } from './text-input';
import { InputBase } from './input-base';
import { DropdownInput } from './select-input';
import { CheckboxInput } from './checkbox-input';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';

@Injectable()
export class DataConvertService {
    // Todo: get from a remote source of question metadata
    // Todo: make asynchronous
    getInputs(fieldsDescription: any[], data: any) {

        const inputs: InputBase<any>[] = [];

        if (fieldsDescription) {
            Object.keys(fieldsDescription).forEach((_dict) => {
                switch (_dict) {
                    case 'rec':
                        Object.keys(fieldsDescription[_dict]).forEach((_key) => {
                            switch (fieldsDescription[_dict][_key].type) {
                                case E_FIELD_TYPE.string:
                                    inputs.push(new StringInput({
                                        key: _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                                case E_FIELD_TYPE.text:
                                    inputs.push(new TextInput({
                                        key: _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                                case E_FIELD_TYPE.boolean:
                                    inputs.push(new CheckboxInput({
                                        key: _key,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                            }
                        });
                        break;
                    case 'sev':
                        inputs.push(new StringInput({
                            key: 'sev',
                            label: 'Индекс СЭВ',
                            value: data['sev']['GLOBAL_ID'],
                        }));
                        break;
                }

            });

        }
        console.log('inputs', inputs);
        return inputs;
    }
}