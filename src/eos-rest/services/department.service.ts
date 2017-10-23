import { Injectable } from '@angular/core';

import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { DEPARTMENT } from '../interfaces/structures';
import { Utils } from '../core/utils';
import { TreeDictionaryService } from './tree-dictionary.service';

const INSTANCE_NAME = 'DEPARTMENT';

@Injectable()
export class DepartmentService extends TreeDictionaryService {
    instance = INSTANCE_NAME;
}
