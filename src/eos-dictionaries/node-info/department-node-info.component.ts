import { Component, OnChanges } from '@angular/core';
import { DEFAULT_PHOTO } from 'eos-dictionaries/consts/common';
import { BaseNodeInfoComponent } from './base-node-info';
import { ROLES_IN_WORKFLOW } from '../consts/roles.const';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges {
    public photo = DEFAULT_PHOTO;
    public update: boolean;
    public roles = ROLES_IN_WORKFLOW;

    bossName: string;
    department: string;

    constructor() {
        super();
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
                this.department = this.node.parent.getParentData('FULLNAME', 'rec') ||
                    this.node.parent.getParentData('CLASSIF_NAME', 'rec');
                    if (this.node.data.photo && this.node.data.photo.url) {
                        this.photo = this.node.data.photo.url;
                    } else {
                        this.photo = DEFAULT_PHOTO;
                    }
            }
        }
    }

    getRole(value: number): string {
        let sRole = this.roles.find((elem) => elem.value === value);
        if (!sRole) {
            sRole = this.roles[0];
        }
        return sRole.title;
    }
}
