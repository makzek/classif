import { Component, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
// import { CardActionService } from './card-action.service';
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
    editMode: boolean;
    private _changed = false;

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
        // private _nodeActSrv: NodeActionsService,
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

        this._profileSubscription = this._profileSrv.settings$.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this.closeRedirect = localStorage.getItem('viewCardUrlRedirect');
    }

    private _update(node: EosDictionaryNode) {
        this.node = node
        this.nodeData = {};
        if (this.node) {
            this.node.getEditView().forEach(fld => {
                this.nodeData[fld.key] = fld.value;
            });
        }

        /* prevent editing multiple cards */
        this.lastEditedCard = this.getLastEditedCard();
        if (this.lastEditedCard && this.lastEditedCard.id !== node.id) {
            this.modalOnlyRef.show();
            this.editMode = false;
        }

        /* prevent editing deleted nodes */
        this.editMode = this.editMode && !this.node.isDeleted;

        if (this.editMode) {
            this._setEditingCardLink();
        }

        this._updateBorders();
    }

    private _init() {
        this.selfLink = this._router.url;
        this.nextRoute = this.selfLink;
        this._urlSegments = this._router.url.split('/');
        const mode = EDIT_CARD_MODES[this._urlSegments[this._urlSegments.length - 1]];
        this.editMode = mode === EDIT_CARD_MODES.edit ? true : false;
        this._dictSrv.getNode(this.dictionaryId, this.nodeId)
            .then((node) => this._update(node))
            .catch((err) => console.log('getNode error', err));
    }

    ngOnDestroy() {
        // this._actionSubscription.unsubscribe();
        this._profileSubscription.unsubscribe();
        // if we went from the same card (from editing to view mode)
        if (this.editMode) {
            this._clearEditingCardLink();
        }
    }

    edit() {
        if (!this.node.isDeleted) {
            this.editMode = true;
        } else {

        }
    }

    save(): void {
        this._clearEditingCardLink();
        /* this.changeMode(); */
    }

    cancel(): void {
        /* do clean */
        this.editMode = false;
        this._clearEditingCardLink();
    }

    recordChanged(changed: boolean) {
        this._changed = changed;
    }

    recordResult(data: any) {
        if (data) {
            this._dictSrv.updateNode(data)
                .then(() => {
                    this._deskSrv.addRecentItem({
                        link: this.selfLink.slice(0, this.selfLink.length - 5),
                        title: this.nodeName,
                    });
                    this._changed = false;
                    this.editMode = false;
                });
        }
    }

    resetAndClose(): void {
        this.cancel();
        this._changed = false;
    }

    saveAndClose(): boolean {
        this.save();
        this._changed = false;
        return true;
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
            if (this.node.neighbors[idx].isVisible(this.showDeleted)) {
                lastIndex = idx;
            }
        }

        this.nodeIndex = this.node.neighbors.findIndex((chld) => chld.id === this.node.id);
        this.isFirst = this.nodeIndex <= firstIndex || firstIndex < 0;
        this.isLast = this.nodeIndex >= lastIndex;
    }

    next() {
        const _node = this.node.neighbors.find((node, idx) => idx > this.nodeIndex && node.isVisible(this.showDeleted));
        this._openNode(_node);
    }

    prev() {
        let _node: EosDictionaryNode = null;

        for (let idx = this.nodeIndex - 1; idx > -1 && !_node; idx--) {
            if (this.node.neighbors[idx].isVisible(this.showDeleted)) {
                _node = this.node.neighbors[idx];
            }
        }
        this._openNode(_node);
    }

    private _openNode(node: EosDictionaryNode) {
        if (node) {
            this.goTo(this._makeUrl(node.id));
        } else {
            this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
        }
    }

    private _makeUrl(nodeId: string, onlyView?: boolean): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 2] = nodeId;

        if (onlyView) {
            _url[_url.length - 1] = 'view';
        }

        return _url.join('/');
    }

    goTo(url: string): void {
        if (url) {
            this._router.navigateByUrl(url).then((navigated) => this._navigationResult(url, navigated));
        } else {
            this._router.navigate([this.nextRoute]).then((res) => this._navigationResult(this.nextRoute, res));
        }
    }

    private _navigationResult(url: string, result: boolean) {
        console.log('navigation result', url, result);
    }

    canDeactivate(nextState?: any): boolean | Promise<boolean> {
        this.nextState = nextState;
        if (this._changed) {
            return this._confirmSrv.confirm(CONFIRM_SAVE_ON_LEAVE)
                .then((save) => {
                    if (save) {
                        return this.saveAndClose();
                    } else {
                        this._clearEditingCardLink();
                    }
                    return true;
                })
                .catch((err) => {
                    console.log('cancel reason', err);
                    return false;
                });
        } else {
            this._clearEditingCardLink();
            return true;
        }
    }

    @HostListener('window:beforeunload', ['$event'])
    private _canWndUnload(evt: BeforeUnloadEvent): any {
        if (this._changed) {
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

    private _setEditingCardLink() {
        this.lastEditedCard = this.getLastEditedCard();
        if (!this.lastEditedCard) {
            localStorage.setItem('lastEditedCard', JSON.stringify({
                'id': this.nodeId,
                'title': this.nodeName,
                'link': this._makeUrl(this.nodeId)
            }));
        }
    }

    _clearEditingCardLink(): void {
        localStorage.removeItem('lastEditedCard');
    }

    getLastEditedCard(): EditedCard {
        return JSON.parse(localStorage.getItem('lastEditedCard'));
    }

    /* hideCardWarning(): void {
        this.modalUnsaveRef.hide();
        this.router.navigate([this.selfLink]);
    }*/
    /*
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
                this._setEditingCardLink();
            }
        } else {
            this._clearEditingCardLink();
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
    */
}
