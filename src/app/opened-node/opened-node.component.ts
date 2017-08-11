import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {

    openedNode: EosDictionaryNode;
    note = '';
    SEV = '';

    constructor(private eosDictService: EosDictService) {

        this.eosDictService.openedNode$.subscribe(
            (node) => {
                this.openedNode = node;
                if (node) {
                    if (node.data) { /* why so? */
                        this.note = node.data.note;
                        this.SEV = node.data.SEV;
                    }
                }
            },
            (error) => alert(error));
    }

}
