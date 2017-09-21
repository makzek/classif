import { Component, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { EditCardActionService } from './edit-card-action.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from './edit-card-action.service';
import { DANGER_NAVIGATE_TO_DELETED_ERROR } from '../consts/messages.consts';

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
export class EditCardComponent implements CanDeactivateGuard, OnDestroy {
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

    showDeleted = false;

    private _dictionarySubscription: Subscription;
    private _actionSubscription: Subscription;
    private _profileSubscription: Subscription;

    @ViewChild('unsavedEdit') public modalUnsaveRef: ModalDirective;
    @ViewChild('onlyEdit') public modalOnlyRef: ModalDirective;

    @HostListener('window:beforeunload')
    private _canWndUnload(): boolean {
        return this.canDeactivate();
    }

    @HostListener('window:blur')
    private _blur(): boolean {
        return this.canDeactivate();
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

    constructor(private _dictSrv: EosDictService,
        private _nodeActSrv: NodeActionsService,
        private _actSrv: EditCardActionService,
        private _deskSrv: EosDeskService,
        private _profileSrv: EosUserProfileService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router) {

        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe((dict) => {
            this._dict = dict;
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
            }
        });

        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.nodeId = params.nodeId;
            this._init();
        });


        this._actionSubscription = this._actSrv.mode$.subscribe((mode) => {
            if (mode === EDIT_CARD_MODES.unsavedChanges) {
                this.setUnsavedChanges();
            }
        });

        this._profileSubscription = this._profileSrv.settings$.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this.closeRedirect = localStorage.getItem('viewCardUrlRedirect');
        /* temporarily! */
        this.clearStorage();
    }

    private _init() {
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
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
        this._profileSubscription.unsubscribe();
            // if we went from the same card (from editing to view mode)
            this.lastEditedCard = this.getLastEditedCard();
            if (this.lastEditedCard && this.lastEditedCard.id === this.nodeId && this.mode === EDIT_CARD_MODES.edit) {
                this.clearStorage();
            }
    }

    save(): void {
        this._actSrv.emitAction(EDIT_CARD_ACTIONS.save);
        this.clearStorage();
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
        this._deskSrv.addRecentItem({
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

    private _makeUrl(nodeId: string, onlyView?: boolean): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 2] = nodeId;

        if (onlyView) {
            _url[_url.length - 1] = 'view';
        }

        return _url.join('/');
    }

    next() {
        if (!this.node.parent.children[this.nodeIndex + 1].isDeleted) {
            this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex + 1].id));
        } else {
            if (this.showDeleted) {
                this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex + 1].id, true));
            } else {
                const _next = this.node.parent.children.slice(this.nodeIndex + 1).findIndex((_n) => !_n.isDeleted);
                /* tslint:disable:no-bitwise */
                if (!!~_next) {
                    this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex + 1 + _next].id));
                } else {
                    this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
                }
                /* tslint:enable:no-bitwise */
            }
        }
    }

    prev() {
        if (!this.node.parent.children[this.nodeIndex - 1].isDeleted) {
            this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex - 1].id));
        } else {
            if (this.showDeleted) {
                this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex - 1].id, true));
            } else {
                const _prev = this.node.parent.children.slice(0, this.nodeIndex).reverse().findIndex((_n) => !_n.isDeleted);

                console.log('prev', this.nodeIndex - _prev - 1);
                /* tslint:disable:no-bitwise */
                if (!!~_prev) {
                    this.goTo(this._makeUrl(this.node.parent.children[this.nodeIndex - _prev - 1].id));
                } else {
                    this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
                }
                /* tslint:enable:no-bitwise */
            }
        }
    }

    goTo(url: string): void {
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

    /* record the card with unsaved changes into the LocalStorage */
    setUnsavedChanges(): void {
        this.wasEdit = true;
    }

    private _setEditingCardValue() {
        this.lastEditedCard = this.getLastEditedCard();
        if (!this.lastEditedCard) {
            localStorage.setItem('lastEditedCard', JSON.stringify({
                'id': this.nodeId,
                'title': this.nodeName,
                'link': this._makeUrl(this.nodeId).replace('/edit', '/view')
            }));
        }
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
                navigate = false;
                /* if we try to edit an other card */
                if (this.nodeId !== this.lastEditedCard.id) {
                    this.modalOnlyRef.show();
                }
            } else {
                this._setEditingCardValue();
            }
        } else {
            this.clearStorage();
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
