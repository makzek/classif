import { Injectable } from '@angular/core';

import { StringInput } from 'eos-common/core/inputs/string-input';
import { TextInput } from 'eos-common/core/inputs/text-input';
import { DropdownInput } from 'eos-common/core/inputs/select-input';
import { CheckboxInput } from 'eos-common/core/inputs/checkbox-input';
import { DateInput } from 'eos-common/core/inputs/date-input';
import { E_FIELD_TYPE } from '../interfaces';
import { GENDERS } from '../consts/dictionaries/department.consts';
import { NOT_EMPTY_STRING } from '../consts/input-validation';

@Injectable()
export class EosDataConvertService {
    // Todo: get from a remote source of question metadata
    // Todo: make asynchronous
    // todo: refactor, remove hardcode, move into record description class
    /**
     * convert fields description and data in same object
     * but with Input for use it in dynamic form
     * @param fieldsDescription node fields description
     * @param data node data
     */
    getInputs(fieldsDescription: any[], data: any, editMode = true) {
        const inputs: any = {};
        if (fieldsDescription) {
            Object.keys(fieldsDescription).forEach((_dict) => {
                switch (_dict) {
                    case 'rec':
                        Object.keys(fieldsDescription[_dict]).forEach((_key) => {
                            switch (fieldsDescription[_dict][_key].type) {
                                case E_FIELD_TYPE.number:
                                case E_FIELD_TYPE.string:
                                    inputs[_dict + '.' + _key] = new StringInput({
                                        key: _dict + '.' + fieldsDescription[_dict][_key].foreignKey,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        pattern: fieldsDescription[_dict][_key].pattern,
                                        isUnic: fieldsDescription[_dict][_key].isUnic,
                                        unicInDict: fieldsDescription[_dict][_key].inDict,
                                        forNode: fieldsDescription[_dict][_key].forNode,
                                        value: data[_dict][fieldsDescription[_dict][_key].foreignKey]
                                            || fieldsDescription[_dict][_key].default,
                                    });
                                    break;
                                case E_FIELD_TYPE.text:
                                    inputs[_dict + '.' + _key] = new TextInput({
                                        key: _dict + '.' + fieldsDescription[_dict][_key].foreignKey,
                                        label: fieldsDescription[_dict][_key].title,
                                        required: fieldsDescription[_dict][_key].required,
                                        invalidMessage: fieldsDescription[_dict][_key].invalidMessage,
                                        height: fieldsDescription[_dict][_key].height,
                                        forNode: fieldsDescription[_dict][_key].forNode,
                                        value: data[_dict][fieldsDescription[_dict][_key].foreignKey],
                                    });
                                    break;
                                case E_FIELD_TYPE.boolean:
                                    inputs[_dict + '.' + _key] = new CheckboxInput({
                                        key: _dict + '.' + fieldsDescription[_dict][_key].foreignKey,
                                        label: fieldsDescription[_dict][_key].title,
                                        forNode: fieldsDescription[_dict][_key].forNode,
                                        value: !!data[_dict][fieldsDescription[_dict][_key].foreignKey],
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.select:
                                    inputs[_dict + '.' + _key] = new DropdownInput({
                                        key: _dict + '.' + fieldsDescription[_dict][_key].foreignKey,
                                        label: fieldsDescription[_dict][_key].title,
                                        options: fieldsDescription[_dict][_key].options,
                                        required: fieldsDescription[_dict][_key].required,
                                        forNode: fieldsDescription[_dict][_key].forNode,
                                        value: data[_dict][fieldsDescription[_dict][_key].foreignKey]
                                            || fieldsDescription[_dict][_key].default,
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.date:
                                    inputs[_dict + '.' + _key] = new DateInput({
                                        key: _dict + '.' + fieldsDescription[_dict][_key].foreignKey,
                                        label: fieldsDescription[_dict][_key].title,
                                        forNode: fieldsDescription[_dict][_key].forNode,
                                        value: data[_dict][fieldsDescription[_dict][_key].foreignKey],
                                    });
                                    break;
                            }
                        });
                        break;
                    case 'sev':
                        inputs['sev.GLOBAL_ID'] = new StringInput({
                            key: 'sev.GLOBAL_ID',
                            label: 'Индекс СЭВ',
                            dict: 'sev',
                            value: data['sev']['GLOBAL_ID'],
                            pattern: NOT_EMPTY_STRING,
                        });
                        break;
                    case 'printInfo':
                        if (data.rec['IS_NODE'] === 1) { // person
                            inputs['printInfo.GENDER'] = new DropdownInput({
                                key: 'printInfo.GENDER',
                                label: 'Пол',
                                dict: 'printInfo',
                                value: data['printInfo']['GENDER'],
                                // options: fieldsDescription['printInfo']['GENDER'].options,
                                options: GENDERS,
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME'] = new StringInput({
                                key: 'printInfo.SURNAME',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                invalidMessage: 'Максимальная длина 64 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.NAME'] = new StringInput({
                                key: 'printInfo.NAME',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                invalidMessage: 'Максимальная длина 64 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.PATRON'] = new StringInput({
                                key: 'printInfo.PATRON',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                invalidMessage: 'Максимальная длина 64 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.DUTY_RP'] = new StringInput({
                                key: 'printInfo.DUTY_RP',
                                label: 'Родительный падеж (кого, чего)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_RP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.DUTY_DP'] = new StringInput({
                                key: 'printInfo.DUTY_DP',
                                label: 'Дательный падеж (кому, чему?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_DP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.DUTY_VP'] = new StringInput({
                                key: 'printInfo.DUTY_VP',
                                label: 'Винительный падеж (кого, что?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_VP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.PRINT_SURNAME_DP'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME_DP',
                                label: 'Фамилия И.О. в дательном падеже',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.PRINT_SURNAME'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME',
                                label: 'И.О. Фамилия в дательном падеже',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.SURNAME_RP'] = new StringInput({
                                key: 'printInfo.SURNAME_RP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.NAME_RP'] = new StringInput({
                                key: 'printInfo.NAME_RP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PATRON_RP'] = new StringInput({
                                key: 'printInfo.PATRON_RP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_RP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.SURNAME_DP'] = new StringInput({
                                key: 'printInfo.SURNAME_DP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.NAME_DP'] = new StringInput({
                                key: 'printInfo.NAME_DP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PATRON_DP'] = new StringInput({
                                key: 'printInfo.PATRON_DP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_DP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.SURNAME_VP'] = new StringInput({
                                key: 'printInfo.SURNAME_VP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.NAME_VP'] = new StringInput({
                                key: 'printInfo.NAME_VP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PATRON_VP'] = new StringInput({
                                key: 'printInfo.PATRON_VP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_VP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.SURNAME_TP'] = new StringInput({
                                key: 'printInfo.SURNAME_TP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.NAME_TP'] = new StringInput({
                                key: 'printInfo.NAME_TP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PATRON_TP'] = new StringInput({
                                key: 'printInfo.PATRON_TP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_TP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.SURNAME_PP'] = new StringInput({
                                key: 'printInfo.SURNAME_PP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.NAME_PP'] = new StringInput({
                                key: 'printInfo.NAME_PP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PATRON_PP'] = new StringInput({
                                key: 'printInfo.PATRON_PP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_PP'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                                hideLabel: true,
                            });
                            inputs['printInfo.PRINT_DUTY'] = new StringInput({
                                key: 'printInfo.PRINT_DUTY',
                                label: 'Должность',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DUTY'],
                                pattern: NOT_EMPTY_STRING,
                                length: 255,
                                invalidMessage: 'Максимальная длина 255 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.PRINT_DEPARTMENT'] = new StringInput({
                                key: 'printInfo.PRINT_DEPARTMENT',
                                label: 'Подразделение',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DEPARTMENT'],
                                pattern: NOT_EMPTY_STRING,
                                invalidMessage: 'Пробелы в начале и в конце строки запрещены.',
                            });
                        } else { // department
                            inputs['printInfo.NOT_USE_IN_DUTY'] = new CheckboxInput({
                                key: 'printInfo.NOT_USE_IN_DUTY.boolean',
                                label: 'Не использовать подразделение в названии должности',
                                dict: 'printInfo',
                                value: data['printInfo']['NOT_USE_IN_DUTY'],
                                disabled: !editMode,
                                pattern: NOT_EMPTY_STRING,
                            });
                            inputs['printInfo.PRINT_DEPARTMENT'] = new TextInput({
                                key: 'printInfo.PRINT_DEPARTMENT',
                                label: 'Полное наименование подразделения',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DEPARTMENT'],
                                pattern: NOT_EMPTY_STRING,
                                length: 2000,
                                invalidMessage: 'Максимальная длина 2000 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                            inputs['printInfo.DEPARTMENT_RP'] = new StringInput({
                                key: 'printInfo.DEPARTMENT_RP',
                                label: 'Наименование подразделения в родительном падеже (чего?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DEPARTMENT_RP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 248,
                                invalidMessage: 'Максимальная длина 248 символов. Пробелы в начале и в конце строки запрещены.',
                            });
                        }
                        break;
                }

            });

        }
        // console.warn('generated inputs', inputs);
        return inputs;
    }
}
