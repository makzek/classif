import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent {

    selectedNode: EosDictionaryNode;

    checkAll: boolean = false;

    dictionaryId: string;
    selectedNodeId: string;
    openedNodeId: string;

    constructor(private _eosDictService: EosDictService, private route: ActivatedRoute) {
        this._eosDictService.selectedNode$.subscribe(
            (node) => {
                if (node) {
                    this.selectedNode = node;
                    this.openedNodeId = this.selectedNode.id.toString();
                }
            },
            (error) => console.log(error)
        );
        this.route.params
            .subscribe((params: Params) => {
                this.dictionaryId = params.dictionaryId;
                this.selectedNodeId = params.nodeId;
                // this.openedNodeId = params.openedNodeId;
                // console.log('params', params);
            }, (error) => console.log(error));

    }

    openFullInfo(childId: number): void {
        this.openedNodeId = childId.toString();
        console.log('openFullInfo', this.dictionaryId, childId);
        this._eosDictService.openNode(this.dictionaryId, childId);
    }

    openThisNode(childId: number): void {
        console.log('openThisNode');
        this._eosDictService.selectNode(this.dictionaryId, childId);
    }

    goToTop(): void {
        console.log('goToTop');
        if (this.selectedNode.parent) {
            this._eosDictService.selectNode(this.dictionaryId, this.selectedNode.parent.id);
        } else {
            alert('Уровень выше не известен');
        }
    }

    checkAllItems(): void {
        this.selectedNode.selected = !this.checkAll;
        if (this.selectedNode.children) {
            for (const item of this.selectedNode.children) {
                item.selected = !this.checkAll;
            }
        }
    }

}
