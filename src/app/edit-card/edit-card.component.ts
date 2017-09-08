import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { IFieldView, FieldGroup } from '../core/field-descriptor';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { EditCardActionService } from '../edit-card/action.service';
import { EosDeskService } from '../services/eos-desk.service';

import { E_FIELD_SET } from '../core/dictionary-descriptor';

@Component({
    selector: 'eos-edit-card',
    templateUrl: 'edit-card.component.html',
})
export class EditCardComponent implements CanDeactivateGuard {

    node: EosDictionaryNode; // TODO: remove it
    dictionaryId: string;
    nodeId: string;
    nodeName: string;
    selfLink: string;
    editMode = true;
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
    nextState: any;
    nextRoute: string;
    parent: EosDictionaryNode;
    mode: string;

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
        private nodeListActionService: NodeActionsService,
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
                this.nextRoute = this.selfLink;
                this.mode = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
                this.editMode = this.mode === 'edit' ? true : false;
                this.actionService.emitMode(this.mode);
                return this.eosDictService.openNode(this.dictionaryId, this.nodeId);
            })
            .subscribe((node) => {
                this._update(node);
                this.eosDictService.dictionary$.subscribe((dict) => {
                    this.dictIdFromDescriptor = dict.descriptor.id;
                    this.viewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.quickView, node.data));
                    this.shortViewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.shortQuickView, node.data));
                    this.nodeName = this.shortViewFields[0].value;
                    this.parent = node.parent;
                });
            }, (error) => alert('error: ' + error));
        this.nodeListActionService.emitAction(null);

        /* this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
                this.eosDictService.openedNode$.subscribe(
                    (node) => {
                        if (node) {
                            this.viewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.quickView, node.data));
                            this.shortViewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.shortQuickView, node.data));
                            this.nodeName = this.shortViewFields[0].value;
                        }
                    },
                    (error) => alert(error));
            }
        }); */
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
            /* if (mode === 'edit') {
                this.openEditMode();
            }
            if (mode === 'view') {
                this.closeEditMode();
            } */
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
        this.goToViewMode();
    }

    cancel(): void {
        this.actionService.emitAction('cancel');
        this.goToViewMode();
    }

    changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this.actionService.emitMode('edit');
        } else {
            this.actionService.emitMode('view');
        }
    }

    recordResult(evt: any) {
        this.wasEdit = false;
        this.editMode = false;
        this.node.data = evt;
        this.eosDictService
            .updateNode(this.dictionaryId, this.nodeId, this.node._descriptor, evt)
            // .catch((err) => alert('err: ' + err));
    }

    resetAndClose(): void {
        this.modalUnsaveRef.hide();
        this.cancel();
        this.clearStorage();
        this.wasEdit = false;
        // this.router.navigate([this.selfLink]);
        // this._location.back();
        if (this.nextState) {
            this.router.navigate([this.nextState.url]);
        } else {
            this.router.navigate([this.nextRoute]);
        }
    }

    saveAndClose(): void {
        this.modalUnsaveRef.hide();
        this.save();
        this.clearStorage();
        this.wasEdit = false;
        // this.router.navigate([this.selfLink]);
        // this._location.back();
        if (this.nextState) {
            this.router.navigate([this.nextState.url]);
        } else {
            this.router.navigate([this.nextRoute]);
        }
    }

    goTo(route: string): void {
        console.log(route);
        if (!this.wasEdit) {
            if (route) {
                this.router.navigate([route]);
            } else {
                this.router.navigate([this.nextRoute]);
            }
        } else {
            if (route.length) {
                this.nextRoute = route;
            }
            this.modalUnsaveRef.show();
        }
    }

    check() {
        /* TODO: rewrite checking with checkbox
        this.node.selected = !this.node.selected;
        if (!this.wasEdit) {
            this.eosDictService.updateNode(this.dictionaryId, this.nodeId, this.node._descriptor, this.data).then(
                () => { },
                (err) => alert('err: ' + err)
            );
        }*/
    }

    canDeactivate(nextState?: any) {
        this.nextState = nextState;
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
        if (!this.lastEditedCard) {
            localStorage.setItem('lastEditedCard', JSON.stringify({ 'id': this.nodeId, 'title': this.nodeName, 'link': this.selfLink }));
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

    goToEditMode() {
        this.router.navigate([
            'spravochniki',
            this.dictionaryId,
            this.nodeId,
            'edit',
        ]);
    }
    goToViewMode() {
        this.router.navigate([
            'spravochniki',
            this.dictionaryId,
            this.nodeId,
            'view',
        ]);
    }
}

/* Object that stores info about the last edited card in the LocalStorage */
class EditedCard {
    id: string;
    title: string;
    link: string;
}
