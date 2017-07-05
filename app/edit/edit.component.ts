import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-edit',
    templateUrl: 'edit.component.html',
})
export class EditComponent {

    node: EosDictionaryNode;
    dictionaryId: string;
    nodeId: string;
    selfLink: string;
    editMode: boolean = false;

    constructor(
        private eosDictService: EosDictService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params
            .switchMap((params: Params): Promise<EosDictionaryNode> => {
                this.dictionaryId = params.dictionaryId;
                this.nodeId = params.nodeId;
                this.selfLink = '/spravochniki/' + this.dictionaryId + '/' + this.nodeId;
                return this.eosDictService.openNode(this.dictionaryId, this.nodeId);
            })
            .subscribe((node) => this._update(node), (error) => alert('error: ' + error));
    }

    private _update(node: EosDictionaryNode) {
        this.node = Object.assign({}, node);
    }

    goPrevPage(): void {
        this.router.navigate(['spravochniki/' + this.dictionaryId + '/' + (this.node.parent).toString() + '/edit']);
    }

    goNextPage(): void { /* wtf */
        this.router.navigate(['spravochniki/' + this.dictionaryId + '/' + (this.nodeId + 1).toString() + '/edit']);
    }

    save(): void {
        // console.log('node', this.node);
        this.eosDictService.updateNode(this.dictionaryId, this.nodeId, this.node).then(
            () => {},
            (err) => alert('err: ' + err)
        );
    }

    cancel(): void {
        this.eosDictService.getNode(this.dictionaryId, this.nodeId)
            .then((node) => this._update(node))
            .catch((error) => alert('error: ' + error));
    }
}
