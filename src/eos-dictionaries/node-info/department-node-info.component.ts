import { Component, OnChanges } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters } from '../interfaces/eos-dictionary.interfaces';

import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges {
    defaultImage = 'url(../assets/images/no-user.png)';
    public update: boolean;

    bossName: string;
    department: string;

    constructor(_dictSrv: EosDictService) {
        super();
        _dictSrv.viewParameters$.subscribe((params: IDictionaryViewParameters) => this.update = params.updatingFields);
    }

    ngOnChanges() {
        super.ngOnChanges();

        if (this.node) {
            if (!this.node.data.rec['IS_NODE'] && this.node.children) {
                const _boss = this.node.children.find((_chld) => _chld.data.rec['POST_H']);
                if (_boss) {
                    this.bossName = _boss.data.rec['SURNAME'];
                } else {
                    this.bossName = '';
                }
            } else {
                this.department = this.node.parent.getParentData('CLASSIF_NAME', 'rec');
            }
        }
    }
}
