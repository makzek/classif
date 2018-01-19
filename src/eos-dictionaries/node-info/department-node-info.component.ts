import { Component, Input } from '@angular/core';
import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent {
    defaultImage = 'url(../assets/images/no-user.png)';
    @Input() bossName: string;

    constructor() {
        super();
    }
}
