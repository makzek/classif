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
    private _dictionaryId: string;

    @Input('node') node: EosDictionaryNode;

    isActive = false;
    selectedNode: EosDictionaryNode;
    showDeleted = false;
    viewFields: IFieldView[];

    constructor(private _router: Router, private _dictSrv: EosDictService, private _profileSrv: EosUserProfileService) {
        _dictSrv.dictionary$.subscribe((dict) => {
            if (dict) {
            this._dictionaryId = dict.id
            }
        });
        _dictSrv.selectedNode$.subscribe((node) => this._update(node));
        _profileSrv.settings$.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });
    }

    private _update(selected: EosDictionaryNode) {
        if (this.node && selected) {
            this.isActive = (selected.id === this.node.id);
        }
        this.selectedNode = selected;
    }

    ngOnInit() {
        this.viewFields = this.node.getListView();
        if (this.selectedNode) {
            this._update(this.selectedNode);
        }
    }

    onExpand(evt: Event, isDeleted: boolean) {
        evt.stopPropagation();
        // if (!isDeleted) {
            this.node.isExpanded = !this.node.isExpanded;
        // }
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
