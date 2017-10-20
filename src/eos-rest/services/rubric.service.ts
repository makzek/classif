import { Injectable } from '@angular/core';
import { BaseDictionaryService } from './base-dictionary.service';
import { RUBRIC_CL } from '../interfaces/structures';
import { IRubricCl, IHierCL } from '../interfaces/interfaces';

@Injectable()
export class RubricService extends BaseDictionaryService {
    instance = 'RUBRIC_CL';
}
