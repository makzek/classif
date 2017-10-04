import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosUserProfileService } from '../..//app/services/eos-user-profile.service';

import { IFieldView } from '../core/field-descriptor';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html',
})
export class TreeNodeComponent implements OnInit {
    @Input('node') node: EosDictionaryNode;
    private _dictionaryId: string;
    private selectedNode: EosDictionaryNode;
    isActive = false;
    showDeleted = false;
    viewFields: IFieldView[];

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
        private _profileSrv: EosUserProfileService
    ) {
        _dictSrv.dictionary$.subscribe((dict) => {
            if (dict) {
                this._dictionaryId = dict.id
            }
        });
        _dictSrv.selectedNode$.subscribe((node) => {
            this.selectedNode = node;
            this._update();
        });

        _profileSrv.settings$
            .map((settings) => settings.find((s) => s.id === 'showDeleted').value)
            .subscribe((s) => this.showDeleted = s);
    }

    private _update() {
        if (this.node && this.selectedNode) {
            this.isActive = (this.selectedNode.id === this.node.id);
        }
    }

    ngOnInit() {
        this.viewFields = this.node.getListView();

        this._update();
    }

    onExpand(evt: Event, isDeleted: boolean) {
        evt.stopPropagation();
        this._dictSrv.expandNode(this.node.id)
            .then((node) => node.isExpanded = !node.isExpanded);
    }

    onSelect(evt: Event, isDeleted: boolean) {
        evt.stopPropagation();

        if (!isDeleted) {
            const _path = [
                'spravochniki',
                this._dictionaryId,
                this.node.id + '',
            ];
            this._router.navigate(_path);
        }
    }
}
