import { Component, Input } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters } from '../interfaces/eos-dictionary.interfaces';
import { DEFAULT_PHOTO } from '../consts/default-img.const';
import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent {
    defaultImage = DEFAULT_PHOTO;
    public update: boolean;

    @Input() bossName: string;

    constructor(_dictSrv: EosDictService) {
        super();
        _dictSrv.viewParameters$.subscribe((params: IDictionaryViewParameters) => this.update = params.updatingFields);
    }
}
