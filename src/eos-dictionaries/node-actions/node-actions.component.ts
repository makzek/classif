import { Component, TemplateRef, ViewChild, HostListener, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/Subscription';

import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeActionsService } from './node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';

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

    private dictionary: EosDictionary;

    buttons: IActionButton[];
    ddButtons: IActionButton[];


    recordActions = RECORD_ACTIONS;
    dropdownRecordActions = DROPDOWN_RECORD_ACTIONS;

    showDeleted = false;
    modalRef: BsModalRef;
    checkAll = false;
    itemIsChecked = false;
    // newNode: EosDictionaryNode;

    searchResults: EosDictionaryNode[];
    searchString: string;
    searchInAllDict = false;

    viewFields: FieldDescriptor[];

    showCheckbox: boolean;

    rootSelected = false;
    allChildrenSelected = false;
    someChildrenSelected = false;

    dropdownIsOpen = false;
    date = new Date();

    fields: IFieldView[];
    searchInDeleted = false;

    innerClick = false;

    lastEditedCard: EditedCard;

    private _userSettingsSubscription: Subscription;
    private _dictionarySubscription: Subscription;
    private _actionSubscription: Subscription;

    newNodeData: any = {};
    private editMode = true;

    @ViewChild('creatingModal') public creatingModal: ModalDirective;

    get noSearchData(): boolean {
        /* tslint:disable:no-bitwise */
        return !~this.fields.findIndex((f) => f.value);
        /* tslint:enable:no-bitwise */
    }

    @HostListener('window:click', [])
    private _closeSearchModal(): void {
        if (!this.innerClick) {
            this.dropdownIsOpen = false;
        }
        this.innerClick = false;
    }

    constructor(
        private _modalSrv: BsModalService,
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _actSrv: NodeActionsService,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _profileSrv: EosUserProfileService,
    ) {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));

        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
            if (_d) {
                this.viewFields = _d.descriptor.getFieldSet(E_FIELD_SET.list);
                this.showCheckbox = _d.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                this.fields = _d.descriptor.getFieldSet(E_FIELD_SET.fullSearch).map((fld) => Object.assign({}, fld, { value: null }));
            }
            this._update();
        });

    }

    private _update() {
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
        switch (action.type) {
            case E_RECORD_ACTIONS.add:
                this.newNodeData = {};
                this.creatingModal.show();
                break;

            case E_RECORD_ACTIONS.userOrder:
                this.switchUserSort();
                break;
            case E_RECORD_ACTIONS.showDeleted: // TODO: check if it works
                this._profileSrv.setSetting('showDeleted', !this.showDeleted);
                break;
            default:
                break;
        }
    }

    switchUserSort() {
        this._actSrv.emitAction(E_RECORD_ACTIONS.userOrder);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
        this.dropdownIsOpen = true;
    }

    public change(value: boolean): void {
        this.dropdownIsOpen = value;
    }

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

    uncheckAllItems() {
        this.checkAll = false;
        this.itemIsChecked = false;
        this.allChildrenSelected = false;
        this.someChildrenSelected = false;
        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRecords);
    }

    search(event) {
        if (event.keyCode === 13) {
            this.dropdownIsOpen = false;
            this._dictSrv.search(this.searchString, this.searchInAllDict);
            event.target.blur();
        }
    }

    fullSearch() {
        this.modalRef.hide();
        this._dictSrv.fullSearch(this.fields, this.searchInDeleted);
    }

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

    dataSeted(date: Date) {
        console.log('recive date: ', date);
    }
}
