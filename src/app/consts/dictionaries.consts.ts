export * from './rubricator.consts';
export * from './department.consts';

import { RUBRICATOR_DICT } from './rubricator.consts';
import { DEPARTMENTS_DICT } from './department.consts';

export const DICT_API_INSTANCES: any = {
    'rubricator': RUBRICATOR_DICT.apiInstance,
    'department': DEPARTMENTS_DICT.apiInstance
};

export const DICTIONARIES = [
    RUBRICATOR_DICT,
    DEPARTMENTS_DICT
];
