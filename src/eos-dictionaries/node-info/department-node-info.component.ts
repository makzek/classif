import { Component, Input } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters } from '../interfaces/eos-dictionary.interfaces';

import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent {
    defaultImage = 'url(../assets/images/no-user.png)';
    public update: boolean;

    @Input() bossName: string;

    constructor(private _dictSrv: EosDictService) {
        super();
        _dictSrv.viewParameters$.subscribe((params: IDictionaryViewParameters) => this.update = params.updatingInfo);
    }
}
