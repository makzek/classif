import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {

    openedNode: EosDictionaryNode/* = {
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
    }*/;

    note: string = '';
    SEV: string = '';

    private _dictionaryId: string;
    private _selectedNode: string;
    private _openedNode: string;

    constructor(private eosDictService: EosDictService, private route: ActivatedRoute) {
        this.route.params
            .subscribe((params: Params) => {
                this._dictionaryId = params.dictionaryId;
                this._selectedNode = params.nodeId;
                this._openedNode = params.openedNodeId;
            },
            (error) => console.log(error)
            );
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
            (error) => console.log(error));
    }

}
