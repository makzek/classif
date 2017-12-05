import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosActiveTreeNodeService } from './active-node-fon.service';

import { IFieldView } from '../core/dictionary.interfaces';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html',
})
export class TreeNodeComponent implements OnInit {
    @Input('node') node: EosDictionaryNode;
    @Input('showDeleted') showDeleted: boolean;
    viewFields: IFieldView[];
    public _fonWidth: number;
    public _fonLeft: number;
    public _fonTop: number;

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
        private _actTreeNodeSrv: EosActiveTreeNodeService
    ) { }

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

    onSelect(evt: Event, isDeleted: boolean, el: HTMLElement) {
        evt.stopPropagation();
        if (!isDeleted) {
            const _path = this._dictSrv.getNodePath(this.node);
            this.calcFullPadding(this.node, el);
            const x = el.getBoundingClientRect();
            console.log(x.top - 109 + 'px')
            this._actTreeNodeSrv.take({
                width: this._fonWidth,
                height: el.clientHeight,
                top: x.top - 109
            })
            this._router.navigate(_path);
        }
    }
    calcFullPadding(node: EosDictionaryNode, el: HTMLElement) {
        console.log(el.offsetTop)
        let fullPadding = 0,
            pnode = node;
        while (pnode.parent) {
            fullPadding += 24;
            pnode = pnode.parent;
        }
        this._fonWidth = el.clientWidth + fullPadding + 50;
    }
}
