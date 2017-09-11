import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { IFieldView, FieldGroup } from '../core/field-descriptor';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { EditCardActionService } from '../edit-card/action.service';
import { EosDeskService } from '../services/eos-desk.service';

import { E_FIELD_SET } from '../core/dictionary-descriptor';

/* Object that stores info about the last edited card in the LocalStorage */
class EditedCard {
    id: string;
    title: string;
    link: string;
}

@Component({
    selector: 'eos-edit-card',
    templateUrl: 'edit-card.component.html',
})
export class EditCardComponent implements CanDeactivateGuard {

    private _dict: EosDictionary;

    parent: EosDictionaryNode;
    node: EosDictionaryNode; // TODO: remove it
    dictionaryId: string;
    dictIdFromDescriptor: string;
    nodeId: string;
    nodeName: string;
    selfLink: string;
    editMode = true;
    private wasEdit = false;
    // hideWarning = true;
    // hideWarningEditing = true;
    private nodeIndex: number = -1;
    isFirst: boolean;
    isLast: boolean;
    /* viewFields: IFieldView[]; */
    /* shortViewFields: IFieldView[]; */
    lastEditedCard: EditedCard;
    closeRedirect: string; /* URL where to redirect after the cross is clicked */
    private nextState: any;
    private nextRoute: string;
    mode: string;

    private _urlSegments: string[];

    @ViewChild('unsavedEdit') public modalUnsaveRef: ModalDirective;
    @ViewChild('onlyEdit') public modalOnlyRef: ModalDirective;

    @HostListener('window:beforeunload')
    private _canWndUnload(): boolean {
        this.clearStorage(); /* why? */
        return this.canDeactivate();
    }

    @HostListener('window:blur')
    private _blur(): boolean {
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

        this.eosDictService.dictionary$.subscribe((dict) => {
            this._dict = dict;
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
            }
        });

        this.route.params
            .switchMap((params: Params): Promise<EosDictionaryNode> => {
                this.dictionaryId = params.dictionaryId;
                this.nodeId = params.nodeId;
                this.selfLink = this.router.url;
                this.nextRoute = this.selfLink;
                this.actionService.emitMode(this.mode);
                this._urlSegments = this.router.url.split('/');
                this.mode = this._urlSegments[this._urlSegments.length - 1];
                this.editMode = this.mode === 'edit' ? true : false;
                this.actionService.emitMode(this.mode);
                return this.eosDictService.openNode(this.dictionaryId, this.nodeId);
            })
            .subscribe((node) => this._update(node), (error) => alert('error: ' + error));

        this.nodeListActionService.emitAction(null);

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
            if (this._dict) {
                const dict = this._dict;
                /* this.viewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.quickView, node.data)); */
                /* this.shortViewFields =  */
                const shortViewFields = node.getValues(dict.descriptor.getFieldSet(E_FIELD_SET.shortQuickView, node.data));
                this.nodeName = shortViewFields[0].value;
                this.parent = node.parent;
                this.nodeIndex = node.parent.children.findIndex((chld) => chld.id === node.id);
                this._updateBorders();
            }
            this.node = new EosDictionaryNode(node._descriptor, node); /* WTF???? */
        }
    }

    save(): void {
        this.actionService.emitAction('save');
        this.changeMode();
    }

    cancel(): void {
        this.actionService.emitAction('cancel');
        this.changeMode();
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
            this.router.navigateByUrl(this.nextState.url);
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
            this.router.navigateByUrl(this.nextState.url);
        } else {
            this.router.navigate([this.nextRoute]);
        }
    }

    private _updateBorders() {
        this.isFirst = this.nodeIndex < 1;
        this.isLast = this.nodeIndex >= this.parent.children.length - 1;
    }

    private _makeUrl(nodeId: string): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 2] = nodeId;

        return _url.join('/');
    }

    next() {
        this.goTo(this._makeUrl(this.parent.children[this.nodeIndex + 1].id));
    }

    prev() {
        this.goTo(this._makeUrl(this.parent.children[this.nodeIndex - 1].id));
    }

    goTo(url: string): void {
        if (!this.wasEdit) {
            if (url) {
                this.router.navigate([url]);
            } else {
                this.router.navigate([this.nextRoute]);
            }
        } else {
            if (url.length) {
                this.nextRoute = url;
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

    changeMode() {
        this.router.navigate([
            'spravochniki',
            this.dictionaryId,
            this.nodeId,
            (this.mode === 'view' ? 'edit' : 'view')
        ]);
    }
}
