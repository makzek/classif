import { Component } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-rooms-card-edit',
    templateUrl: 'rooms-card-edit.component.html',
})
export class RoomsCardEditComponent extends CardEditComponent {
    showOwners = true;
    showUsers = true;
    showAccess = true;

    constructor() {
        super();
    }
}
