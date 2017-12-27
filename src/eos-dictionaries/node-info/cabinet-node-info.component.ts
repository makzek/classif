import { Component, Input } from '@angular/core';

import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-cabinet-node-info',
    templateUrl: 'cabinet-node-info.component.html',
})
export class CabinetNodeInfoComponent extends BaseNodeInfoComponent {
    constructor() {
        super();
    }
}
