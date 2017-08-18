import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { IFieldView } from '../core/field-descriptor';

@Component({
    selector: 'eos-edit-card',
    templateUrl: 'edit-card.component.html',
})
export class EditCardComponent {

    node: EosDictionaryNode;
    dictionaryId: string;
    nodeId: string;
    selfLink: string;
    editMode = false;
    wasEdit = false;
    hideWarning = true;
    i: number = -1;
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    constructor(
        private eosDictService: EosDictService,
        private actionService: NodeListActionsService,
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
        this.actionService.emitAction(null);

        this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.eosDictService.openedNode$.subscribe(
                (node) => {
                    if (node) {
                        this.viewFields = node.getValues(dict.descriptor.quickViewFields);
                        this.shortViewFields = node.getValues(dict.descriptor.shortQuickViewFields);
                    }
                },
                (error) => alert(error));
                }
        });
    }

    private _update(node: EosDictionaryNode) {
        if (node) {
            this.node = new EosDictionaryNode(node._descriptor, node);
            this.i = node.parent.children.findIndex((chld) => chld.id === node.id);
        }
    }

    save(): void {
        this.wasEdit = false;
        this.eosDictService
            .updateNode(this.dictionaryId, this.nodeId, this.node)
            .catch((err) => alert('err: ' + err));
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

    check() {
        this.node.selected = !this.node.selected;
        if (!this.wasEdit) {
            this.eosDictService.updateNode(this.dictionaryId, this.nodeId, this.node).then(
                () => { },
                (err) => alert('err: ' + err)
            );
        }
    }
}
