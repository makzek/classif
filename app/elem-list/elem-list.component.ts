import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../dictionary/eos-dictionary-node';

@Component({
    selector: 'eos-elem-list',
    templateUrl: 'elem-list.component.html',
})
export class ElemListComponent {

    openNode: EosDictionaryNode = {
        id: null,
        parent: null,
        children: null,
        code: null,
        title: null,
        description: null,
        isDeleted: null,
        selected: null,
        data: null
    };

    checkAll: boolean = false;

    constructor(private eosDictService: EosDictService) {
        this.eosDictService.openNode$.subscribe((node) => {
            if(node) this.openNode = node
        }, (err) => console.error(err));
    }

    openFullInfo(childId: number): void {
        this.eosDictService.dictionary$.subscribe((dictionary) => this.eosDictService.selectNode(dictionary.id, childId));
    }

    openThisNode(childId: number): void {
        this.eosDictService.dictionary$.subscribe((dictionary) => this.eosDictService.openNode(dictionary.id, childId));
    }

    checkAllItems(): void {
        for(let item of this.openNode.children){
            item.selected = this.checkAll;
        }
    }

}