import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { IFieldView, FieldGroup } from '../core/field-descriptor';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';

@Component({
    selector: 'eos-edit-card',
    templateUrl: 'edit-card.component.html',
})
export class EditCardComponent implements CanDeactivateGuard {

    node: EosDictionaryNode;
    dictionaryId: string;
    nodeId: string;
    nodeName: string;
    selfLink: string;
    editMode = false;
    wasEdit = false;
    hideWarning = true;
    hideWarningEditing = true;
    i: number = -1;
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];
    fieldGroups: FieldGroup[];
    currIndex = 0;
    colCount: number;
    lastEditedCard: EditedCard;

    @HostListener('window:beforeunload') canDeactivate2(): boolean {
        this.clearStorage();
        return this.canDeactivate();
    }
    @HostListener('window:blur') canDeactivate3(): boolean {
        this.clearStorage();
        return this.canDeactivate();
    }
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
                        this.nodeName = this.shortViewFields[0].value;
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
        this.clearStorage();
        this.router.navigate([this.selfLink]);
    }

    saveAndClose(): void {
        this.save();
        this.clearStorage();
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

    canDeactivate() {
        if (this.wasEdit) {
            /* if there are any unsaved changes, an action required */
            this.hideWarning = false;
            return false;
        }
        return true;
    }

    openEditMode(): void {
        this.lastEditedCard = this.getLastEditedCard();
        if (this.lastEditedCard) {
            if (this.wasEdit) { /* if we just switched from view-mode to edit-mode */
                this.editMode = true;
            } else {
                 /* try to edit a different card */
                if (this.nodeId !== this.lastEditedCard.id) {
                    this.hideWarningEditing = false;
                /* forbid the edit-mode on other browser tabs */
                } else {
                    this.editMode = false;
                }
            }
        } else {
            this.editMode = true;
        }
    }

    closeEditMode(): void {
        this.editMode = false;
    }

    /* we record the card with unsaved changes into the LocalStorage */
    setUnsavedChanges(): void {
        this.lastEditedCard = this.getLastEditedCard();
        if (! this.lastEditedCard) {
            localStorage.setItem('lastEditedCard', JSON.stringify({'id': this.nodeId, 'title': this.nodeName, 'link': this.selfLink}));
        }
        this.wasEdit = true;
    }

    clearStorage(): void {
        localStorage.removeItem('lastEditedCard');
    }

    getLastEditedCard(): EditedCard {
        return JSON.parse(localStorage.getItem('lastEditedCard'));
    }

}

/* Object that stores info about the last edited card in the LocalStorage */
class EditedCard {
    id: string;
    title: string;
    link: string;
}
