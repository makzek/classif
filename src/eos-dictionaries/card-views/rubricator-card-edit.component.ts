import { Component } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends CardEditComponent {

     constructor() {
        super();
    }
}
