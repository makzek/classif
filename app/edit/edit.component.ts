import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-edit',
    templateUrl: 'edit.component.html',
})
export class EditComponent {

    node: EosDictionaryNode;
    dictionaryName: string;
    nodeId: number;
    selfLink: string;
    editMode: boolean = false;

    constructor(
        private eosDictService: EosDictService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params
            .switchMap((params: Params): Promise<EosDictionaryNode> => {
                this.dictionaryName = params.dictionaryName;
                this.nodeId = +params.nodeId;
                this.selfLink = '/spravochniki/' + this.dictionaryName + '/' + this.nodeId;
                return this.eosDictService.getNode(this.dictionaryName, this.nodeId);
            })
            .subscribe((node: EosDictionaryNode) => { this.node = node; }, (error) => { console.log('error', error); });
    }

    goPrevPage(): void {
        this.router.navigate(['spravochniki/' + this.dictionaryName + '/' + (this.nodeId - 1).toString() + '/edit']);
    }

    goNextPage(): void {
        this.router.navigate(['spravochniki/' + this.dictionaryName + '/' + (this.nodeId + 1).toString() + '/edit']);
    }

    save(): void {
        console.log('node', this.node);
        this.eosDictService.setNode(this.node);
    }

    cancel(): void {
        this.eosDictService.getNode(this.node.title, this.node.id)
        .then((node) => { this.node = node; })
        .catch((error) => { console.log('error', error); });
    }
}
