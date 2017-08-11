import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html',
})
export class TreeNodeComponent implements OnInit {
    private _dictionaryId: string;

    @Input('node') node: EosDictionaryNode;

    isActive = false;
    selectedNode: EosDictionaryNode;

    constructor(private _router: Router, private _dictSrv: EosDictService) {
        _dictSrv.dictionary$.subscribe((dict) => this._dictionaryId = dict.id);
        _dictSrv.selectedNode$.subscribe((node) => this._update(node));
    }

    private _update(selected: EosDictionaryNode) {
        if (this.node && selected) {
            this.isActive = (selected.id === this.node.id);
        }
        this.selectedNode = selected;
    }

    ngOnInit() {
        if (this.selectedNode) {
            this._update(this.selectedNode);
        }
    }

    onExpand(evt: Event) {
        evt.stopPropagation();
        this.node.isExpanded = !this.node.isExpanded;
    }

    onSelect(evt: Event) {
        evt.stopPropagation();

        const _path = [
            'spravochniki',
            this._dictionaryId,
            this.node.id + '',
        ];
        this._router.navigate(_path);
    }
}
