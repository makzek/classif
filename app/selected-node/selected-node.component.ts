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
                    // Uncheck all checboxes before changing selectedNode
                    if (this.selectedNode) {
                        this.checkAllItems(false);
                    }
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
        this.checkAllItems(false);
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

    checkAllItems(value: boolean = !this.checkAll): void {
        this.checkAll = value;
        this.selectedNode.selected = this.checkAll;
        if (this.selectedNode.children) {
            for (const item of this.selectedNode.children) {
                item.selected = this.checkAll;
            }
        }
    }

    checkItem(item: EosDictionaryNode): void {
        item.selected = !item.selected;
        this.checkAll = false;
    }

    deleteSelectedItems(): void {
        if (this.openedNode.selected && this.openedNode !== this.selectedNode) {
            this.openFullInfo(this.openedNode.parent.id);
        }
        if (this.selectedNode.selected) {
            this._eosDictService.deleteSelectedNodes(this._dictionaryId, [this.selectedNode.id]);
            if (this.selectedNode.parent) {
                this.selectNode(this.selectedNode.parent.id);
            } else {
                this.selectNode('');
            }
            return;
        }
        const selectedNodes: string[] = [];
        this.selectedNode.children.forEach((child) => {
            if (child.selected && !child.isDeleted) {
                selectedNodes.push(child.id);
            }
        });
        this._eosDictService.deleteSelectedNodes(this._dictionaryId, selectedNodes);
    }
}
