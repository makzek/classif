import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-tree-node',
    templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {
    private _dictionaryId: string;
    private _nodeId: number;

    constructor(private _route: ActivatedRoute, private _dictSrv: EosDictService) {
    }
}
