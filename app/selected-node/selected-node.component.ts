import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

    private _dictionaryId: string;

    constructor(private _eosDictService: EosDictService, private router: Router) {
        this._eosDictService.dictionary$.subscribe(
            (dictionary) => {
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                }
            },
            (error) => alert(error)
        );
        this._eosDictService.selectedNode$.subscribe(
            (node) => {
                this.selectedNode = node;
                if (node) {
                    this.openFullInfo(node.id);
                }
            },
            (error) => alert(error)
        );
        this._eosDictService.openedNode$.subscribe(
            (node) => {
                this.openedNode = node;
            },
            (error) => alert(error)
        );
    }

    openFullInfo(childId: string): void {
        this._eosDictService.openNode(this._dictionaryId, childId);
    }

    selectNode(nodeId: string): void {
        this.router.navigate(['spravochniki', this._dictionaryId, nodeId]);
    }

    editNode() {
        this.router.navigate([
            'spravochniki',
            this._dictionaryId,
            this.openedNode ? this.openedNode.id : this.selectedNode.id,
            'edit',
        ]);
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
