import { Injectable } from '@angular/core';
import { TreeDictionaryService } from './tree-dictionary.service';
import { RUBRIC_CL } from '../interfaces/structures';
import { IRubricCl, IHierCL } from '../interfaces/interfaces';

@Injectable()
export class RubricService extends TreeDictionaryService {
    instance = 'RUBRIC_CL';
}
