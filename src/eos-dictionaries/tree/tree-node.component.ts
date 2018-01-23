import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IFieldView } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html',
})
export class TreeNodeComponent implements OnInit {
    @Input('node') node: EosDictionaryNode;
    @Input('showDeleted') showDeleted: boolean;
    @Input() layer: number;
    viewFields: IFieldView[];
    public _fonWidth: number;
    public _fonLeft: number;
    public _fonTop: number;

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) { }

    ngOnInit() {
        this.viewFields = this.node.getTreeView();
    }

    onExpand(evt: Event/*, isDeleted: boolean*/) {
        evt.stopPropagation();
        if (this.node.isExpanded) {
            this.node.isExpanded = false;
        } else {
            this.node.updating = true;
            this._dictSrv.expandNode(this.node.id)
                .then((node) => {
                    node.isExpanded = true;
                    this.node.updating = false;
                });
        }
    }

    onSelect(evt: Event, isDeleted: boolean/*, el: HTMLElement*/) {
        evt.stopPropagation();
        if (!isDeleted) {
            const _path = this.node.getPath();
            this._router.navigate(_path);
        }
    }
}
