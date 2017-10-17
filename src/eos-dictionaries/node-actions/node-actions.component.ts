import { Component, TemplateRef, ViewChild, HostListener, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';


import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeActionsService } from './node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { IFieldView } from '../core/field-descriptor';

import { RECORD_ACTIONS, DROPDOWN_RECORD_ACTIONS } from '../consts/record-actions.consts';
import { EditedCard } from '../card/card.component';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';

import { IActionButton, IAction } from '../core/action.interface';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnDestroy {
    @Input() params: any;
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    buttons: IActionButton[];
    ddButtons: IActionButton[];

    private dictionary: EosDictionary;
    private _dictionarySubscription: Subscription;

    constructor(
        private _dictSrv: EosDictService,
    ) {
        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe((dict) => this._update(dict));
    }

    private _update(dictionary: EosDictionary) {
        this.dictionary = dictionary;
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));
    }

    private _actionToButton(action: IAction): IActionButton {
        let _enabled = false;
        let _active = false;

        if (this.dictionary) {
            _enabled = this.dictionary.descriptor.canDo(action.group, action.type);
            switch (action.type) {
                case E_RECORD_ACTIONS.moveUp:
                case E_RECORD_ACTIONS.moveDown:
                    _enabled = this.params.userSort && _enabled;
                    break;
                case E_RECORD_ACTIONS.restore:
                    _enabled = this.params.showDeleted && _enabled;
                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _active = this.params.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    _active = this.params.userSort;
                    break;
            }
        }

        return Object.assign({
            isActive: _active,
            enabled: _enabled
        }, action);
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
    }

    doAction(action: IAction) {
        this.action.emit(action.type);
    }
    /*
    switchUserSort() {
        this._actSrv.emitAction(E_RECORD_ACTIONS.userOrder);
    }
    */
    /*
    checkAllItems() {
        if (this.checkAll) {
            this.rootSelected = true;
            this.allChildrenSelected = true;
            this.itemIsChecked = false;
            this._actSrv.emitAction(E_RECORD_ACTIONS.markRecords);
        } else {
            this.itemIsChecked = false;
            this.allChildrenSelected = false;
            this.someChildrenSelected = false;
            this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRecords);
        }
    }
    */
    /*
    uncheckAllItems() {
        this.checkAll = false;
        this.itemIsChecked = false;
        this.allChildrenSelected = false;
        this.someChildrenSelected = false;
        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRecords);
    }
    */
    /*
    create(hide = true) {
        // this._editActSrv.emitAction(EDIT_CARD_ACTIONS.create);
        this._dictSrv.addNode(this.newNodeData)
            .then((node) => {
                console.log('created node', node);
                let title = '';
                node.getShortQuickView().forEach((_f) => {
                    title += this.newNodeData[_f.key];
                });
                const bCrumbs = this._breadcrumbsSrv.getBreadcrumbs();
                let path = '';
                for (const bc of bCrumbs) {
                    path = path + bc.title + '/';
                }
                this._deskSrv.addRecentItem({
                    link: this._dictSrv.getNodePath(node.id).join('/'),
                    title: title,
                    fullTitle: path + title
                });
                if (hide) {
                    this.creatingModal.hide();
                }
                this.newNodeData = {};
            });
    }

    cancelCreate() {
        this.creatingModal.hide();
    }
    */
}
