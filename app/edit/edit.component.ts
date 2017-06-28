import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service'
import { EosDictionaryNode } from '../dictionary/eos-dictionary-node'

@Component({
    selector: 'eos-edit',
    templateUrl: 'edit.component.html',
})
export class EditComponent {
    constructor(private eosDictService: EosDictService, private route: ActivatedRoute) {
    };

    node: EosDictionaryNode;

    onInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.eosDictService.getNode(params['dictionaryName'], +params['nodeId']))
            .subscribe((node: EosDictionaryNode) => this.node = node);
    };
}
