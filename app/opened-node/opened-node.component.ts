import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {

    openedNode: EosDictionaryNode = {
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
        data: null,
    };

    note: string = '';
    SEV: string = '';

    constructor(private eosDictService: EosDictService) {
        this.eosDictService.openedNode$.subscribe(
            (node) => {
                if (node) {
                    this.openedNode = node;
                    if (node.data) {
                        this.note = node.data.note;
                        this.note = node.data.SEV;
                    }
                }
            },
            console.error);
    }

}
