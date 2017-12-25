import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent {
    showOwners = true;
    showUsers = true;
    showAccess = true;
    owner: any[] = [];

    constructor(injector: Injector) {
        super(injector);
    }

}
