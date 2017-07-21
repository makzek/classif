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
    wasEdit: boolean = false;
    hideWarning: boolean = true;

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
        if (node) {
            this.node = new EosDictionaryNode(node);
        }
    }

    save(): void {
        this.wasEdit = false;
        // console.log('node', this.node);
        this.eosDictService.updateNode(this.dictionaryId, this.nodeId, this.node).then(
            () => {},
            (err) => alert('err: ' + err)
        );
    }

    cancel(): void {
        this.wasEdit = false;
        this.eosDictService.getNode(this.dictionaryId, this.nodeId)
            .then((node) => this._update(node))
            .catch((error) => alert('error: ' + error));
    }

    resetAndClose(): void {
        this.cancel();
        this.router.navigate([this.selfLink]);
    }

    saveAndClose(): void {
        this.save();
        this.router.navigate([this.selfLink]);
    }

    goTo(route: string): void {
        if (!this.wasEdit) {
            this.router.navigate([route]);
        } else {
            this.hideWarning = false;
        }
    }
}
