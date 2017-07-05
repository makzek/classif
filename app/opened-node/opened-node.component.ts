import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {

    openedNode: EosDictionaryNode;

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
            (error) => alert(error)
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
            (error) => alert(error));
    }

}
