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
  getInputs(fieldsDescription: any[]) {

    const inputs: InputBase<any>[] = [

      /*new DropdownInput({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          { key: 'solid', value: 'Solid' },
          { key: 'great', value: 'Great' },
          { key: 'good', value: 'Good' },
          { key: 'unproven', value: 'Unproven' }
        ],
        order: 3
      }),

      new TextInput({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
        readonly: false,
        invalidMessage: '{EQ{EQ{EQ!!!'
      }),

      new TextInput({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
        readonly: false,
      }),

      new CheckboxInput({
        key: 'isBoss',
        label: 'is boss',
        order: 4,
        readonly: false,
      })*/
    ];

    if (fieldsDescription) {
      Object.keys(fieldsDescription).forEach((_dict) => {
        Object.keys(fieldsDescription[_dict]).forEach((_key) => {
          switch (fieldsDescription[_dict][_key].type) {
            case E_FIELD_TYPE.string:
              inputs.push(new StringInput({
                key: _key,
                label: fieldsDescription[_dict][_key].title,
                required: fieldsDescription[_dict][_key].required,
                invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                value: '',
              }));
              break;
            case  E_FIELD_TYPE.text:
            inputs.push(new TextInput({
              key: _key,
              label: fieldsDescription[_dict][_key].title,
              required: fieldsDescription[_dict][_key].required,
              invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
              value: '',
            }));
            break;
            case  E_FIELD_TYPE.boolean:
            inputs.push(new CheckboxInput({
              key: _key,
            }));
            break;
          }
        });
      });

    }

    return inputs;
  }
}
