import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { IFieldView } from '../core/field-descriptor';
import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/action.service';

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
    dictIdFromDescriptor: string;

    constructor(
        private eosDictService: EosDictService,
        private nodeListActionService: NodeListActionsService,
        private route: ActivatedRoute,
        private router: Router,
        private actionService: EditCardActionService,
    ) {
        this.route.params
            .switchMap((params: Params): Promise<EosDictionaryNode> => {
                this.dictionaryId = params.dictionaryId;
                this.nodeId = params.nodeId;
                this.selfLink = '/spravochniki/' + this.dictionaryId + '/' + this.nodeId;
                return this.eosDictService.openNode(this.dictionaryId, this.nodeId);
            })
            .subscribe((node) => this._update(node), (error) => alert('error: ' + error));
        this.nodeListActionService.emitAction(null);

        this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
                this.eosDictService.openedNode$.subscribe(
                (node) => {
                    if (node) {
                        this.viewFields = node.getValues(dict.descriptor.quickViewFields);
                        // this.shortViewFields = node.getValues(dict.descriptor.shortQuickViewFields);
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
        this.actionService.emitAction('save');
    }

    cancel(): void {
        this.actionService.emitAction('cancel');
    }

    recordResult(evt: any) {
        this.wasEdit = false;
        this.editMode = false;
        this.node.data = evt;
        this.eosDictService
            .updateNode(this.dictionaryId, this.nodeId, this.node)
            .catch((err) => alert('err: ' + err));
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
