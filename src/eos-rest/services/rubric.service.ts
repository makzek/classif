import { Injectable } from '@angular/core';
import { TreeDictionaryService } from './tree-dictionary.service';

@Injectable()
export class RubricService extends TreeDictionaryService {
    protected instance = 'RUBRIC_CL';
}
