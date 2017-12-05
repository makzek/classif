import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

import { IFieldView } from '../core/dictionary.interfaces';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html',
})
export class TreeNodeComponent implements OnInit {
    @Input('node') node: EosDictionaryNode;
    @Input('showDeleted') showDeleted: boolean;
    viewFields: IFieldView[];

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) {
     }

    ngOnInit() {
        this.viewFields = this.node.getListView();
    }

    onExpand(evt: Event, isDeleted: boolean) {
        evt.stopPropagation();
        if (this.node.isExpanded) {
            this.node.isExpanded = false;
        } else {
            this._dictSrv.expandNode(this.node.id)
                .then((node) => node.isExpanded = true);
        }
    }

    onSelect(evt: Event, isDeleted: boolean) {
        evt.stopPropagation();

        if (!isDeleted) {
            const _path = this._dictSrv.getNodePath(this.node);
            this._router.navigate(_path);
        }
    }
}
