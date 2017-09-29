import { Component, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { CardActionService } from './card-action.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';

import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from './card-action.service';
import { DANGER_NAVIGATE_TO_DELETED_ERROR, INFO_NOTHING_CHANGES } from '../consts/messages.consts';
import { CONFIRM_SAVE_ON_LEAVE } from '../consts/confirm.consts';

/* Object that stores info about the last edited card in the LocalStorage */
export class EditedCard {
    id: string;
    title: string;
    link: string;
}

@Component({
    selector: 'eos-card',
    templateUrl: 'card.component.html',
})
export class CardComponent implements CanDeactivateGuard, OnDestroy {
    private _dict: EosDictionary;
    private node: EosDictionaryNode;
    private nodeData: any;

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

    private _actionSubscription: Subscription;
    private _profileSubscription: Subscription;
    private _dictionarySubscription: Subscription;

    @ViewChild('onlyEdit') public modalOnlyRef: ModalDirective;

    get nodeName() {
        let _nodeName = '';
        if (this.node) {
            this.node.getShortQuickView()
                .forEach((_f) => {
                    _nodeName += _f.value;
                });
        }
        return _nodeName;
    }

    constructor(
        private _confirmSrv: ConfirmWindowService,
        private _dictSrv: EosDictService,
        private _actSrv: CardActionService,
        private _deskSrv: EosDeskService,
        private _profileSrv: EosUserProfileService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.nodeId = params.nodeId;
            this._init();
        });
        /*
        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe((dict) => {
            this._dict = dict;
            if (dict) {
                this.dictIdFromDescriptor = dict.descriptor.id;
            }
        });
        */
        /*
        this._actionSubscription = this._actSrv.mode$.subscribe((mode) => {
            if (mode === EDIT_CARD_MODES.unsavedChanges) {
                this.wasEdit = true;
            }
            if (mode === EDIT_CARD_MODES.nothingChanges) {
                this.wasEdit = false;
                this._msgSrv.addNewMessage(INFO_NOTHING_CHANGES);
            }
        });
        */
        this._profileSubscription = this._profileSrv.settings$.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this.closeRedirect = localStorage.getItem('viewCardUrlRedirect');
    }

    private _prepareNodeData() {
        this.nodeData = {};
        if (this.node) {
            this.node.getEditView().forEach(fld => {
                this.nodeData[fld.key] = fld.value;
            });
        }
    }

    private _init() {
        console.log('init fired');
        this.selfLink = this._router.url;
        this.nextRoute = this.selfLink;
        this._urlSegments = this._router.url.split('/');
        this.mode = EDIT_CARD_MODES[this._urlSegments[this._urlSegments.length - 1]];
        this.editMode = this.mode === EDIT_CARD_MODES.edit ? true : false;
        this._dictSrv.getNode(this.dictionaryId, this.nodeId)
            .then((node) => {
                this.node = node;
                if (node) {
                    this._prepareNodeData();
                    this.nodeIndex = node.parent.children.findIndex((chld) => {
                        return chld.id === node.id;
                    });
                    this._updateBorders();
                    if (node.isDeleted && this.mode === EDIT_CARD_MODES.edit) { // for unexpected situation
                        this.goTo(this._makeUrl(node.id, true));
                    }
                    this._actSrv.emitMode(this.mode);
                }
            }).catch((err) => console.log('getNode error', err));
    }

    ngOnDestroy() {
        // this._actionSubscription.unsubscribe();
        this._profileSubscription.unsubscribe();
        // if we went from the same card (from editing to view mode)
        this.lastEditedCard = this.getLastEditedCard();
        if (this.lastEditedCard && this.lastEditedCard.id === this.nodeId && this.mode === EDIT_CARD_MODES.edit) {
            this.clearStorage();
        }
    }

    save(): void {
        // this._actSrv.emitAction(EDIT_CARD_ACTIONS.save);
        this.clearStorage();
        this.changeMode();
    }

    cancel(): void {
        // this._actSrv.emitAction(EDIT_CARD_ACTIONS.cancel);
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

    recordChanged(changed: boolean) {
        this.wasEdit = changed;
    }

    recordResult(data: any) {
        if (data) {
            this._dictSrv.updateNode(data)
                .then(() => {
                    this._deskSrv.addRecentItem({
                        link: this.selfLink.slice(0, this.selfLink.length - 5),
                        title: this.nodeName,
                    });
                    this.wasEdit = false;
                    this.editMode = false;
                });
        }
    }

    resetAndClose(): void {
        this.cancel();
        this.clearStorage();
        this.wasEdit = false;
    }

    saveAndClose(): void {
        this.save();
        this.clearStorage();
        this.wasEdit = false;
        /*
        // this.router.navigate([this.selfLink]);
        // this._location.back();
        if (this.nextState) {
            this._router.navigateByUrl(this.nextState.url);
        } else {
            this._router.navigate([this.nextRoute]);
        }
        */
    }


    private _updateBorders() {
        const firstIndex = this.node.neighbors.findIndex((node) => node.isVisible(this.showDeleted));
        let lastIndex = -1;

        for (let idx = this.node.neighbors.length - 1; idx > lastIndex; idx--) {
            if (this.node.neighbors[idx].isVisible) {
                lastIndex = idx;
            }
        }

        this.isFirst = this.nodeIndex <= firstIndex || firstIndex < 0;
        this.isLast = this.nodeIndex >= lastIndex;

        console.log('first last', firstIndex, lastIndex);
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
        const _node = this.node.neighbors.find((node, idx) => idx > this.nodeIndex && node.isVisible(this.showDeleted));
        if (_node) {
            this.goTo(this._makeUrl(_node.id));
        } else {
            this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
        }
    }

    prev() {
        const _node = this.node.neighbors.find((node, idx) => idx < this.nodeIndex && node.isVisible(this.showDeleted));
        if (_node) {
            this.goTo(this._makeUrl(_node.id));
        } else {
            this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
        }
    }

    goTo(url: string): void {
        if (url) {
            console.log('going to', url);
            this._router.navigateByUrl(url).then((navigated) => this._navigationResult(url, navigated));
        } else {
            console.log('nextroute', this.nextRoute);
            this._router.navigate([this.nextRoute]).then((res) => this._navigationResult(this.nextRoute, res));
        }
    }

    private _navigationResult(url: string, result: boolean) {
        console.log('navigation result', url, result);
    }

    canDeactivate(nextState?: any): boolean | Promise<boolean> {
        this.nextState = nextState;
        if (this.wasEdit) {
            return this._confirmSrv.confirm(CONFIRM_SAVE_ON_LEAVE)
                .then((save) => {
                    console.log('save confirmed', save);
                    if (save) {
                        this.saveAndClose();
                    } else {
                        this.resetAndClose();
                    }
                    return true;
                })
                .catch((err) => {
                    console.log('cancel reason', err);
                    return false;
                });
        } else {
            console.log('can deactivate');
            return true;
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    private _canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.wasEdit) {
            evt.returnValue = CONFIRM_SAVE_ON_LEAVE.body;
            return false;
        }
    }

    /* todo: check tasks for reson
    @HostListener('document:blur')
    private _blur(): boolean {
        return this.canDeactivate();
    }
    */

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
                if (this.nodeId !== this.lastEditedCard.id) {
                    navigate = false;
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
