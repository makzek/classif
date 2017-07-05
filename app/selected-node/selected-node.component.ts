import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent {

    selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;

    checkAll: boolean = false;

    dictionaryId: string;
    selectedNodeId: string;
    openedNodeId: string;

    constructor(private _eosDictService: EosDictService, private route: ActivatedRoute, private router: Router) {
        this._eosDictService.selectedNode$.subscribe(
            (node) => {
                if (node) {
                    this.selectedNode = node;
                    this.openedNodeId = this.selectedNode.id.toString();
                }
            },
            (error) => alert(error)
        );
        this._eosDictService.openedNode$.subscribe(
            (node) => {
                if (node) {
                    this.openedNode = node;
                }
            },
            (error) => alert(error)
        );
        this.route.params
            .subscribe((params: Params) => {
                this.dictionaryId = params.dictionaryId;
                this.selectedNodeId = params.nodeId;
                // this.openedNodeId = params.openedNodeId;
                // console.log('params', params);
            }, (error) => alert(error));

    }

    openFullInfo(childId: string): void {
        this.openedNodeId = childId.toString();
        this._eosDictService.openNode(this.dictionaryId, childId);
    }

    selectNode(nodeId: string): void {
        this.router.navigate(['spravochniki', this.dictionaryId, nodeId]);
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
