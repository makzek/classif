import { Injectable } from '@angular/core';

import { TextInput } from './text-input';
import { InputBase } from './input-base';
import { DropdownInput } from './select-input';
import { CheckboxInput } from './checkbox-input';
import { E_FIELD_TYPE } from '../../eos-dictionaries/core/dictionary.interfaces';

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

    console.log('fieldsDescription', fieldsDescription);
    console.log(E_FIELD_TYPE, E_FIELD_TYPE.string);
    /*fieldsDescription.forEach((_descr) => {
      switch (E_FIELD_TYPE[_descr.type]) {
        case E_FIELD_TYPE['string']:
          console.log('text');
          break;
      }
    });*/

    return inputs.sort((a, b) => a.order - b.order);
  }
}
