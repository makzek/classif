import { Injectable } from '@angular/core';
import { TreeDictionaryService } from './tree-dictionary.service';

@Injectable()
export class DepartmentService extends TreeDictionaryService {
    instance = 'DEPARTMENT';
}
