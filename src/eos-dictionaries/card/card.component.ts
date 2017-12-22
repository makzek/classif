import { Component, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { CanDeactivateGuard } from '../../app/guards/can-deactivate.guard';
import { EosStorageService } from '../../app/services/eos-storage.service';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import {
    DANGER_NAVIGATE_TO_DELETED_ERROR,
    INFO_NOTHING_CHANGES,
    DANGER_EDIT_DELETED_ERROR,
    SUCCESS_SAVE
} from '../consts/messages.consts';
import { NAVIGATE_TO_ELEMENT_WARN } from '../../app/consts/messages.consts';
import { CONFIRM_SAVE_ON_LEAVE } from '../consts/confirm.consts';
import { LS_EDIT_CARD } from '../consts/common';
// import { UUID } from 'angular2-uuid';

export enum EDIT_CARD_MODES {
    edit,
    view,
};

/* Object that stores info about the last edited card in the LocalStorage */
export class EditedCard {
    id: string;
    title: string;
    link: string;
    // uuid: string;
}

@Component({
    selector: 'eos-card',
    templateUrl: 'card.component.html',
})
export class CardComponent implements CanDeactivateGuard, OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();

    node: EosDictionaryNode;
    nodes: EosDictionaryNode[];

    nodeData: any = {};
    private _originalData: any = {};
    isChanged = false;
    fieldsDescription: any = {};

    dictionaryId: string;
    private nodeId: string;
    private _uuid: string;

    private _urlSegments: string[];
    private nodeIndex: number = -1;

    isFirst: boolean;
    isLast: boolean;

    lastEditedCard: EditedCard;
    closeRedirect: string; /* URL where to redirect after the cross is clicked */

    private nextRoute: string;

    private _mode: EDIT_CARD_MODES;
    editMode: boolean;

    selfLink = null;

    disableSave = false;

    @ViewChild('onlyEdit') modalOnlyRef: ModalDirective;

    /* todo: check tasks for reson
    @HostListener('document:blur')
    private _blur(): boolean {
        return this.canDeactivate();
    }
    */

    @HostListener('window:beforeunload', ['$event'])
    private _canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.editMode) {
            /* clean link on close or reload */
            /* cann't handle user answer */
            this._clearEditingCardLink();
        }
        if (this.isChanged) {
            evt.returnValue = CONFIRM_SAVE_ON_LEAVE.body;
            return false;
        }
    }

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
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService,
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _msgSrv: EosMessageService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this.selfLink = this._router.url;
        this._route.params.subscribe((params) => {
            this.dictionaryId = params.dictionaryId;
            this.nodeId = params.nodeId;
            this._init();
        });

        this._dictSrv.currentList$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => this.nodes = nodes);
    }

    ngOnInit() {
        // this._init();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

        if (this.editMode) {
            this._clearEditingCardLink();
        }
    }

    turnOffSave(val: boolean) {
        this.disableSave = val;
    }

    private _init() {
        this.nextRoute = this._router.url;
        this._urlSegments = this._router.url.split('/');
        this._mode = EDIT_CARD_MODES[this._urlSegments[this._urlSegments.length - 1]];
        this._getNode();
    }

    private _getNode() {
        return this._dictSrv.getFullNode(this.dictionaryId, this.nodeId)
            .then((node) => {
                if (node) {
                    this._update(node)
                } else {
                    const segments: Array<string> = this._router.url.split('/');
                    this._router.navigate(['spravochniki/' + segments[2]]);
                    this._msgSrv.addNewMessage(NAVIGATE_TO_ELEMENT_WARN);
                }
            }).catch((err) => console.log('getNode error', err));
    }

    private _initNodeData(node: EosDictionaryNode) {
        this.node = node;

        this.nodeData = {
            rec: {}
        };
        if (this.node) {
            /* this.fields = this.node.getEditView();
            this.fields.forEach(fld => {
                this.nodeData[fld.key] = fld.value;
            });*/
            this.fieldsDescription = this.node.getEditFieldsDescription();
            this.nodeData = this.node.getEditData();
            console.log('recived description', this.nodeData);
        }
    }

    private _update(node: EosDictionaryNode) {
        let _canEdit: boolean;

        this._initNodeData(node);

        _canEdit = this._mode === EDIT_CARD_MODES.edit &&
            this._preventDeletedEdit() &&
            this._preventMultiEdit();

        if (_canEdit) {
            this._setEditingCardLink();
            this._setOriginalData();
        }

        this.editMode = _canEdit;
        this._updateBorders();
    }

    private _setOriginalData() {
        this._originalData = this.cloneData(this.nodeData);
        this.recordChanged(this.nodeData);
    }

    forceView() {
        if (this._mode === EDIT_CARD_MODES.edit) {
            this._openNode(this.node, EDIT_CARD_MODES.view);
        }
    }

    private _preventMultiEdit(): boolean {
        /* prevent editing multiple cards */
        this.getLastEditedCard();
        if (this.lastEditedCard && this.lastEditedCard.id !== this.nodeId /* && this.lastEditedCard.uuid !== this._uuid*/) {
            this.modalOnlyRef.show();
            return false;
        }
        return true;
    }

    private _preventDeletedEdit(): boolean {
        if (!this.node.isDeleted) {
            return true;
        } else {
            /* show warn */
            this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
            return false;
        }
    }

    edit() {
        const _canEdit = this._preventMultiEdit() && this._preventDeletedEdit();
        if (_canEdit) {
            this._openNode(this.node, EDIT_CARD_MODES.edit);
        }
    }

    close() {
        const url = this._storageSrv.getItem(RECENT_URL);
        if (url) {
            this.goTo(url);
        } else {
            const backUrl = this._dictSrv.getNodePath(this.node.parent || this.node);
            this._router.navigate(backUrl);
            /*Generate back URL*/
            /*
            const urlSegments = this._router.url.split('/');
            urlSegments[3] = this.node.parentId;
            urlSegments.length--;
            const backUrl = urlSegments.join('/');
            this.goTo(backUrl);*/
        }
        if (window.innerWidth > 1500) {
            /*this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openTree);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openInfo);*/
        }
    }


    cancel(): void {
        /* _askForSaving fired on route change */
        this._openNode(this.node, EDIT_CARD_MODES.view);
    }

    recordChanged(data: any) {
        if (this.nodeData) {
            // console.log('recordChanged', this.nodeData, this._originalData);
            /* tslint:disable:no-bitwise */
            const hasChanges = !!~Object.keys(this.nodeData).findIndex((dict) => {
                if (this.nodeData[dict] && this._originalData[dict]) {
                    return !!~Object.keys(this.nodeData[dict]).findIndex((key) => {
                        return (this.nodeData[dict][key] !== this._originalData[dict][key]) &&
                            (key !== '__metadata') && (key !== '_more_json') && (key !== '_orig');
                    });
                } else {
                    return false;
                }
            });
            /* tslint:enable:no-bitwise */
            this.isChanged = hasChanges;
        }
    }

    private _updateBorders() {
        this.nodeIndex = this.nodes.findIndex((node) => node.id === this.node.id);
        this.isFirst = this.nodeIndex <= 0;
        this.isLast = this.nodeIndex >= this.nodes.length - 1 || this.nodeIndex < 0;
    }

    next() {
        if (this.nodeIndex < this.nodes.length - 1) {
            this.nodeIndex++;
            this._openNode(this.nodes[this.nodeIndex]);
        }
    }

    prev() {
        if (this.nodeIndex > 0) {
            this.nodeIndex--;
            this._openNode(this.nodes[this.nodeIndex]);
        }
    }

    disManager(mod: boolean, tooltip: any): boolean {
        if (mod) {
            if (this.isFirst || !this.node.parent) {
                tooltip.hide()
                return true
            } else {
                return false
            }
        } else {
            if (this.isLast || !this.node.parent) {
                tooltip.hide()
                return true
            } else {
                return false
            }
        }
    }

    private _openNode(node: EosDictionaryNode, forceMode?: EDIT_CARD_MODES) {
        if (node) {
            this.goTo(this._makeUrl(node.id, forceMode));
        } else {
            this._msgSrv.addNewMessage(DANGER_NAVIGATE_TO_DELETED_ERROR);
        }
    }

    private _makeUrl(nodeId: string, forceMode?: EDIT_CARD_MODES): string {
        const _url = [].concat([], this._urlSegments);
        _url[_url.length - 2] = nodeId;

        if (forceMode !== undefined && EDIT_CARD_MODES[forceMode]) {
            _url[_url.length - 1] = EDIT_CARD_MODES[forceMode];
        }
        return _url.join('/');
    }

    goTo(url: string): void {
        if (url) {
            this._router.navigateByUrl(url);
        } else {
            this._router.navigate([this.nextRoute]);
        }
    }

    canDeactivate(nextState?: any): boolean | Promise<boolean> {
        return this._askForSaving();
    }

    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
            return this._confirmSrv.confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE,
                { confirmDisabled: this.disableSave }))
                .then((doSave) => {
                    if (doSave == null) {
                        return false;
                    } else {
                        if (doSave) {
                            return this._save(this.nodeData)
                                .then((node) => {
                                    if (node) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                        } else {
                            this._reset();
                            return true;
                        }
                    }
                })
                .catch((err) => {
                    // console.log('cancel reason', err);
                    return false;
                });
        } else {
            this._reset();
            return Promise.resolve(true);
        }
    }

    save(): void {
        this._save(this.nodeData)
            .then((node) => {
                if (node) {
                    this._initNodeData(node);
                    this._setOriginalData();
                    this.cancel();
                }
            });
    }

    private _save(data: any): Promise<any> {
        // console.log('save', data);
        return this._dictSrv.updateNode(this.node, data)
            .then((resp: EosDictionaryNode) => {
                this._msgSrv.addNewMessage(SUCCESS_SAVE);
                /*
                const fullTitle = this._fullTitle(resp);
                console.log('fullTitle', fullTitle);
                */
                this._deskSrv.addRecentItem({
                    url: this._router.url,
                    title: resp.data.rec.CLASSIF_NAME,
                    /* fullTitle: fullTitle */
                });
                this._clearEditingCardLink();
                return resp;
            })
            .catch((err) => this._errHandler(err));
    }

    /*
    private _fullTitle(node: EosDictionaryNode) {
        let parent = node.parent;
        let arr = [node.data.rec.CLASSIF_NAME];
        while (parent.parent) {
            arr.push(parent.data.rec.CLASSIF_NAME);
            parent = parent.parent;
        }
        arr.push(parent.data.rec.RUBRIC_CODE);
        arr.push('Справочники');
        arr = arr.reverse();
        const fullTItle = arr.join('/');
        return fullTItle;
    }
    */
    private _reset(): void {
        if (this.isChanged) {
            /* do reset data */
            this.nodeData = this.cloneData(this._originalData);
        }
        if (this.editMode) {
            this.editMode = false;
            this._clearEditingCardLink();
        }
    }

    private _setEditingCardLink() {
        this.getLastEditedCard();
        if (!this.lastEditedCard) {
            this.lastEditedCard = {
                'id': this.nodeId,
                'title': this.nodeName,
                'link': this._makeUrl(this.nodeId, EDIT_CARD_MODES.edit),
                // uuid: this._uuid
            };
            console.log('this.nodeId', this.nodeId);
            this._storageSrv.setItem(LS_EDIT_CARD, this.lastEditedCard, true);
        }
    }

    private _clearEditingCardLink(): void {
        if (this.lastEditedCard && this.lastEditedCard.id === this.nodeId) {
            this.lastEditedCard = null;
            this._storageSrv.removeItem(LS_EDIT_CARD);
        }
    }

    private getLastEditedCard() {
        this.lastEditedCard = this._storageSrv.getItem(LS_EDIT_CARD);
        /*
        if (this.lastEditedCard && !this.lastEditedCard.uuid) {
            this.lastEditedCard.uuid = this._uuid;
        }
        */
    }

    private _errHandler(err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage,
            dismissOnTimeout: 100000
        });
        return null;
    }

    private cloneData(src: any): any {
        try {
            return JSON.parse(JSON.stringify(src));
        } catch (e) {
            console.log(e);
        }
    }

}
