import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { IFieldView, FieldGroup } from '../core/field-descriptor';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { EditCardActionService } from '../edit-card/action.service';
import { EosDeskService } from '../services/eos-desk.service';

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
    // hideWarning = true;
    // hideWarningEditing = true;
    i: number = -1;
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];
    fieldGroups: FieldGroup[];
    currIndex = 0;
    colCount: number;
    lastEditedCard: EditedCard;
    dictIdFromDescriptor: string;
    closeRedirect: string; /* URL where to redirect after the cross is clicked */

    @ViewChild('unsavedEdit') public modalUnsaveRef: ModalDirective;
    @ViewChild('onlyEdit') public modalOnlyRef: ModalDirective;

    @HostListener('window:beforeunload') canDeactivate2(): boolean {
        this.clearStorage();
        return this.canDeactivate();
    }
    @HostListener('window:blur') canDeactivate3(): boolean {
        return this.canDeactivate();
    }
    constructor(
        private eosDictService: EosDictService,
        private nodeListActionService: NodeListActionsService,
        private route: ActivatedRoute,
        private router: Router,
        private actionService: EditCardActionService,
        private _deskService: EosDeskService,
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
                        this.shortViewFields = node.getValues(dict.descriptor.shortQuickViewFields);
                        this.nodeName = this.shortViewFields[0].value;
                    }
                },
                (error) => alert(error));
                }
        });
        /* To identify the current desktop ID */
        this.closeRedirect = this.selfLink;
        this._deskService.selectedDesk.subscribe(
            (link) => {
                if (link && link.id !== 'system') {
                    this.closeRedirect = '/home/' + link.id;
                } else {
                    this.closeRedirect = this.selfLink;
                }
            }
        );

        this.actionService.mode$.subscribe((mode) => {
            if (mode === 'edit') {
                this.openEditMode();
            }
            if (mode === 'view') {
                this.closeEditMode();
            }
            if (mode === 'unsavedChanges') {
                this.setUnsavedChanges();
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
        this.modalUnsaveRef.hide();
        this.cancel();
        this.clearStorage();
        this.wasEdit = false;
        this.router.navigate([this.selfLink]);
    }

    saveAndClose(): void {
        this.modalUnsaveRef.hide();
        this.save();
        this.clearStorage();
        this.wasEdit = false;
        this.router.navigate([this.selfLink]);
    }

    goTo(route: string): void {
        if (!this.wasEdit) {
            this.router.navigate([route]);
        } else {
            this.modalUnsaveRef.show();
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
            // this.hideWarning = false;
            this.modalUnsaveRef.show();
            return false;
        }
        return true;
    }

    openEditMode(): void {
        this.lastEditedCard = this.getLastEditedCard();
        // console.log(this.lastEditedCard);
        if (this.lastEditedCard) {
            if (this.wasEdit) { /* if we just switched from view-mode to edit-mode */
                this.editMode = true;
            } else {
                 /* try to edit a different card */
                if (this.nodeId !== this.lastEditedCard.id) {
                    // this.hideWarningEditing = false;
                    this.modalOnlyRef.show();
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

    hideCardWarning(): void {
        // this.hideWarningEditing = true;
        this.modalUnsaveRef.hide();
        this.router.navigate([this.selfLink]);
    }
}

/* Object that stores info about the last edited card in the LocalStorage */
class EditedCard {
    id: string;
    title: string;
    link: string;
}
