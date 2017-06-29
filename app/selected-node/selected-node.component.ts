import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
        isExpanded: null,
        isDeleted: null,
        selected: null,
        data: null
    };

    note: string = '';
    SEV: string = '';

    constructor(private eosDictService: EosDictService) {
        this.eosDictService.currentNode$.subscribe((node) => {
            if (node) this.selectedNode = node;
            if (node) 
                if (node.data){
                    this.note = node.data.note;
                    this.note = node.data.SEV;
                }
        }, (err) => console.error(err));
    }

}