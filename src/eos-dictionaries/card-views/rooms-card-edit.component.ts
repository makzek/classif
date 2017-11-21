import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-rooms-card-edit',
    templateUrl: 'rooms-card-edit.component.html',
})
export class RoomsCardEditComponent extends BaseCardEditComponent {
    showOwners = true;
    showUsers = true;
    showAccess = true;

    constructor(injector: Injector) {
        super(injector);
    }
}
