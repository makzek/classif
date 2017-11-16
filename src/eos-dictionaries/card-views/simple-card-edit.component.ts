import { Component } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})
export class SimpleCardEditComponent extends BaseCardEditComponent {
    constructor() {
        super();
    }

    checkCode(val: any) {
        if (this) {
            /* tslint:disable:no-bitwise */
            return !!~this.nodeSet.findIndex((_node) => _node.data['RUBRIC_CODE'] === val);
            /* tslint:enable:no-bitwise */
        } else {
            return null;
        }
    }
}
