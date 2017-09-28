import { Component } from '@angular/core';

import { CardEditComponent } from './card-edit.component';
import { TITLE_LENGTH, DESCRIPTION_LENGTH } from '../consts/input-validation';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends CardEditComponent {

    readonly titleLenth = TITLE_LENGTH;
    readonly descriptionLength = DESCRIPTION_LENGTH;

     constructor() {
        super();
    }
}
