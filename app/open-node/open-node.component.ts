import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-open-node',
    templateUrl: 'open-node.component.html',
})
export class OpenNodeComponent {

    openNode: EosDictionaryNode = {
        id: null,
        code: null,
        title: null,
        parent: null,
        children: null,
        description: null,
        isNode: null,
        isExpanded: null,
        isDeleted: null,
        selected: null,
        data: null
    };

    checkAll: boolean = false;

    constructor(private eosDictService: EosDictService) {
        this.eosDictService.openNode$.subscribe((node) => {
            if (node) this.openNode = node
        }, (err) => console.error(err));
    }

    openFullInfo(childId: number): void {
        this.eosDictService.dictionary$.subscribe((dictionary) => this.eosDictService.selectNode(dictionary.id, childId));
    }

    openThisNode(childId: number): void {
        this.eosDictService.dictionary$.subscribe((dictionary) => this.eosDictService.openNode(dictionary.id, childId));
    }

    goToTop(): void {
        if(this.openNode.parent) this.eosDictService.dictionary$.subscribe((dictionary) => this.eosDictService.openNode(dictionary.id, this.openNode.parent.id));
        else alert('Уровень выше не известен');
    }

    checkAllItems(): void {
        for (let item of this.openNode.children) {
            item.selected = this.checkAll;
        }
    }

}