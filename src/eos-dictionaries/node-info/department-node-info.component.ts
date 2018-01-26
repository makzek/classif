import { Component, OnChanges } from '@angular/core';
import { DEFAULT_PHOTO } from 'eos-dictionaries/consts/common';
import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-department-node-info',
    templateUrl: 'department-node-info.component.html',
})
export class DepartmentNodeInfoComponent extends BaseNodeInfoComponent implements OnChanges {
    photo = DEFAULT_PHOTO;
    public update: boolean;

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
}
