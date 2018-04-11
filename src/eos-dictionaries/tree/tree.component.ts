import { Component, Input, OnInit } from '@angular/core';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { Router } from '@angular/router';
import { EosDictService } from '../services/eos-dict.service';
import { IFieldView } from '../interfaces';

const BIG_PANEL = 340,
    SMALL_PANEL = 260,
    PADDING_W = 32,
    BIG_DISPLAY_W = 1600;

@Component({
    selector: 'eos-tree',
    templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {
    readonly paddingWidth = PADDING_W;
    @Input() nodes: EosDictionaryNode[];
    @Input() showDeleted: boolean;
    @Input() layer: number;
    viewFields: IFieldView[];
    public w: number;
    public _fonWidth: number;
    public _fonLeft: number;
    public _fonTop: number;

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) { }

    ngOnInit() {
        this.viewFields = this.nodes[0].getTreeView();
        this.onResize();
    }

    onExpand(evt: Event, node: EosDictionaryNode/*, isDeleted: boolean*/) {
        evt.stopPropagation();
        if (node.isExpanded) {
            node.isExpanded = false;
        } else {
            node.updating = true;
            this._dictSrv.expandNode(node.id)
                .then((_node) => {
                    _node.isExpanded = true;
                    node.updating = false;
                });
        }
    }

    onSelect(evt: Event, node: EosDictionaryNode) {
        evt.stopPropagation();
        if (!node.isDeleted) {
            const _path = node.getPath();
            this._router.navigate(_path);
        }
    }

    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
      }
}
