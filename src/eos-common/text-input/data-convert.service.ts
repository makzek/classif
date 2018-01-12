import { Injectable } from '@angular/core';

import { StringInput } from './string-input';
import { TextInput } from './text-input';
import { InputBase } from './input-base';
import { DropdownInput } from './select-input';
import { CheckboxInput } from './checkbox-input';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';

const NOT_EMPTY_STRING = /^\S(.*\S$|$)/;

@Injectable()
export class DataConvertService {
    // Todo: get from a remote source of question metadata
    // Todo: make asynchronous
    getInputs(fieldsDescription: any[], data: any) {
        console.log('fieldsDescription', fieldsDescription);

        const inputs: InputBase<any>[] = [];

        if (fieldsDescription) {
            Object.keys(fieldsDescription).forEach((_dict) => {
                switch (_dict) {
                    case 'rec':
                        Object.keys(fieldsDescription[_dict]).forEach((_key) => {
                            switch (fieldsDescription[_dict][_key].type) {
                                case E_FIELD_TYPE.string:
                                    inputs.push(new StringInput({
                                        key: _dict + '.' + _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        pattern: fieldsDescription[_dict][_key].pattern,
                                        isUnic: fieldsDescription[_dict][_key].isUnic,
                                        unicInDict: fieldsDescription[_dict][_key].inDict,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                                case E_FIELD_TYPE.text:
                                    inputs.push(new TextInput({
                                        key: _dict + '.' + _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                                case E_FIELD_TYPE.boolean:
                                    inputs.push(new CheckboxInput({
                                        key: _dict + '.' + _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                                case E_FIELD_TYPE.select:
                                    inputs.push(new DropdownInput({
                                        key: _dict + '.' + _key,
                                        label: fieldsDescription[_dict][_key].title,
                                        options: fieldsDescription[_dict][_key].options,
                                        required: fieldsDescription[_dict][_key].required,
                                        value: data[_dict][_key],
                                    }));
                                    break;
                            }
                        });
                        break;
                    case 'sev':
                        inputs.push(new StringInput({
                            key: 'sev.GLOBAL_ID',
                            label: 'Индекс СЭВ',
                            dict: 'sev',
                            value: data['sev']['GLOBAL_ID'],
                            pattern: NOT_EMPTY_STRING,
                        }));
                        break;
                }

            });

        }
        console.log('inputs', inputs);
        return inputs;
    }
}
