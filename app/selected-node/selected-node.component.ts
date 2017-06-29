import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent {

    selectedNode: EosDictionaryNode = {
        id: null,
        code: null,
        title: null,
        parent: null,
        children: null,
        description: null,
        isNode: null,
        hasSubnodes: null,
        isExpanded: null,
        isDeleted: null,
        selected: null,
        data: null,
    };

    checkAll: boolean = false;

    constructor(private _eosDictService: EosDictService) {
        this._eosDictService.selectedNode$.subscribe(
            (node) => {
                if (node) {
                    this.selectedNode = node;
                }
            },
            console.error
        );
    }

    openFullInfo(childId: number): void {
        this._eosDictService.dictionary$.subscribe(
            (dictionary) => this._eosDictService.selectNode(dictionary.id, childId)
        );
    }

    openThisNode(childId: number): void {
        this._eosDictService.dictionary$.subscribe(
            (dictionary) => this._eosDictService.openNode(dictionary.id, childId)
        );
    }

    goToTop(): void {
        if (this.selectedNode.parent) {
            this._eosDictService.dictionary$.subscribe(
                (dictionary) => this._eosDictService.openNode(dictionary.id, this.selectedNode.parent.id)
            );
        } else {
            alert('Уровень выше не известен');
        }
    }

    checkAllItems(): void {
        for (const item of this.selectedNode.children) {
            item.selected = this.checkAll;
        }
    }

}
