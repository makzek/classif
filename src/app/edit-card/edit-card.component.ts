import { Component, HostListener, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { IFieldView, FieldGroup } from '../core/field-descriptor';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { EditCardActionService } from '../edit-card/action.service';
import { EosDeskService } from '../services/eos-desk.service';

import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from './action.service';

/* Object that stores info about the last edited card in the LocalStorage */
export class EditedCard {
    id: string;
    title: string;
    link: string;
}

@Component({
    selector: 'eos-edit-card',
    templateUrl: 'edit-card.component.html',
})
export class EditCardComponent implements CanDeactivateGuard, OnDestroy, OnInit {
    private _dict: EosDictionary;
    dictIdFromDescriptor: string;

    node: EosDictionaryNode;

    dictionaryId: string;
    nodeId: string;
    selfLink: string;
    private _urlSegments: string[];

    private nodeIndex: number = -1;
    isFirst: boolean;
    isLast: boolean;

    lastEditedCard: EditedCard;
    closeRedirect: string; /* URL where to redirect after the cross is clicked */

    private nextState: any;
    private nextRoute: string;

    mode: EDIT_CARD_MODES;
    editMode = true;
    private wasEdit = false;


    private _dictionarySubscription: Subscription;
    private _actionSubscription: Subscription;

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

    constructor(private _dictSrv: EosDictService,
        private _nodeActSrv: NodeActionsService,
        private _actSrv: EditCardActionService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _deskService: EosDeskService) {
        console.log('constructor');
        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe((dict) => {
            this._dict = dict;
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
            }
        });

        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.nodeId = params.nodeId;
        });

        this.selfLink = this._router.url;
        this.nextRoute = this.selfLink;
        this._urlSegments = this._router.url.split('/');
        this.mode = EDIT_CARD_MODES[this._urlSegments[this._urlSegments.length - 1]];
        this.editMode = this.mode === EDIT_CARD_MODES.edit ? true : false;
        this._actSrv.emitMode(this.mode);
        this._dictSrv.getNode(this.dictionaryId, this.nodeId)
            .then((node) => {
                this.node = node;
                if (node) {
                    this.nodeIndex = node.parent.children.findIndex((chld) => {
                        return chld.id === node.id;
                    });
                    this._updateBorders();
                }
            }).catch((err) => console.log('getNode error', err));

        this._nodeActSrv.emitAction(null);

        this._actionSubscription = this._actSrv.mode$.subscribe((mode) => {
            if (mode === EDIT_CARD_MODES.unsavedChanges) {
                this.setUnsavedChanges();
            }
        });

        this.closeRedirect = localStorage.getItem('viewCardUrlRedirect');
    }

    get nodeName() {
        let _nodeName = '';
        if (this.node) {
            this.node.getValues(this._dict.descriptor
                .getFieldSet(E_FIELD_SET.shortQuickView, this.node.data)).forEach((_f) => {
                    _nodeName += _f.value;
                });
        }
        return _nodeName;
    }

    ngOnInit() {
        console.log('on init');
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
    }

    save(): void {
        this._actSrv.emitAction(EDIT_CARD_ACTIONS.save);
        this.changeMode();
    }

    cancel(): void {
        this._actSrv.emitAction(EDIT_CARD_ACTIONS.cancel);
        this.changeMode();
    }

    /* changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this.actionService.emitMode(EDIT_CARD_MODES.edit);
        } else {
            this.actionService.emitMode(EDIT_CARD_MODES.view);
        }
    }*/

    recordResult(evt: any) {
        this.wasEdit = false;
        this.editMode = false;
        this._dictSrv.updateNode(this.dictionaryId, this.nodeId, this._dict.descriptor.record, evt);
        this._deskService.addRecentItem({
            link: this.selfLink.slice(0, this.selfLink.length - 5),
            title: this.nodeName,
            edited: false,
        });
    }

    resetAndClose(): void {
        this.modalUnsaveRef.hide();
        this.cancel();
        this.clearStorage();
        this.wasEdit = false;
        // this.router.navigate([this.selfLink]);
        // this._location.back();
        if (this.nextState) {
            this._router.navigateByUrl(this.nextState.url);
        } else {
            this._router.navigate([this.nextRoute]);
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
            this._router.navigateByUrl(this.nextState.url);
        } else {
            this._router.navigate([this.nextRoute]);
        }
    }

    private _updateBorders() {
        this.isFirst = this.nodeIndex < 1;
        this.isLast = this.nodeIndex >= this.node.parent.children.length - 1;
    }

    private _makeUrl(nodeId: string): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 2] = nodeId;

        return _url.join('/');
    }

    next() {
        console.log('this.nodeIndex', this.nodeIndex);
        // this.nodeIndex++;
        this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex + 1].id));
    }

    prev() {
        console.log('this.nodeIndex', this.nodeIndex);
        // this.nodeIndex--;
        this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex - 1].id));
    }

    goTo(url: string): void {
        console.log('goTo', url);
        if (!this.wasEdit) {
            if (url) {
                this._router.navigate([url]);
            } else {
                this._router.navigate([this.nextRoute]);
            }
        } else {
            if (url.length) {
                this.nextRoute = url;
            }
            this.modalUnsaveRef.show();
        }
    }

    canDeactivate(nextState?: any) {
        this.nextState = nextState;
        if (this.wasEdit) {
            /* if there are any unsaved changes, an action required */
            this.modalUnsaveRef.show();
            return false;
        }
        return true;
    }

    closeEditMode(): void { /* Somebody use it? */
        this.editMode = false;
    }

    /* we record the card with unsaved changes into the LocalStorage */
    setUnsavedChanges(): void {
        this.lastEditedCard = this.getLastEditedCard();
        if (!this.lastEditedCard) {
            localStorage.setItem('lastEditedCard', JSON.stringify({
                'id': this.nodeId,
                'title': this.nodeName,
                'link': this._makeUrl(this.nodeId).replace('/edit', '/view')
            }));
        }
        this.wasEdit = true;
    }

    clearStorage(): void {
        localStorage.removeItem('lastEditedCard');
    }

    getLastEditedCard(): EditedCard {
        return JSON.parse(localStorage.getItem('lastEditedCard'));
    }

    /* hideCardWarning(): void {
        this.modalUnsaveRef.hide();
        this.router.navigate([this.selfLink]);
    }*/

    changeMode() {
        let navigate = true;
        this.lastEditedCard = this.getLastEditedCard();
        if (this.mode === EDIT_CARD_MODES.view) {
            if (this.lastEditedCard) {
                if ( ! this.wasEdit) {
                    navigate = false;
                    /* if we try to edit an other card */
                    if (this.nodeId !== this.lastEditedCard.id) {
                        this.modalOnlyRef.show();
                    }
                }
            }
        }
        if (navigate) {
            this._router.navigate([
                'spravochniki',
                this.dictionaryId,
                this.nodeId,
                (this.mode === EDIT_CARD_MODES.view ? 'edit' : 'view')
            ]);
        }
    }
}
