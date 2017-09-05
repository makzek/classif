import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { EditCardActionService } from '../edit-card/action.service';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent {
    showDeleted = false;
    modalRef: BsModalRef;
    checkAll = false;
    itemIsChecked = false;
    // newNode: EosDictionaryNode;

    searchResults: EosDictionaryNode[];
    searchString: string;
    searchInAllDict = false;

    dictionary: EosDictionary;
    viewFields: FieldDescriptor[];

    showCheckbox: boolean;
    showAdd: boolean;
    showDelete: boolean;
    showEdit: boolean;
    showDeleteHard: boolean;

    showUserSort: boolean;
    showUserSortUp: boolean;
    showUserSortDown: boolean;
    userSort = false;
    // rootSelected = false;

    dropdownIsOpen = false;
    date = new Date();

    fields: IFieldView[];
    searchInDeleted = false;

    dictIdFromDescriptor: string;

    @ViewChild('creatingModal') public creatingModal: ModalDirective;

    get noSearchData(): boolean {
        /* tslint:disable:no-bitwise */
        return !~this.fields.findIndex((f) => f.value);
        /* tslint:enable:no-bitwise */
    }

    constructor(private _userSettingsService: EosUserSettingsService,
        private modalService: BsModalService,
        private _dictionaryService: EosDictService,
        private _actionService: NodeListActionsService,
        private _editCardActionService: EditCardActionService) {
        this._userSettingsService.settings.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });
        this._dictionaryService.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
            if (_d) {
                this.dictIdFromDescriptor = _d.descriptor.id;
                this.viewFields = _d.descriptor.getFieldSet(E_FIELD_SET.list);

                this.showCheckbox = _d.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                this.showAdd = _d.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.add);
                this.showEdit = _d.descriptor.canDo(E_ACTION_GROUPS.item, E_RECORD_ACTIONS.edit);
                this.showDelete = _d.descriptor.canDo(E_ACTION_GROUPS.group, E_RECORD_ACTIONS.remove);
                this.showDeleteHard = _d.descriptor.canDo(E_ACTION_GROUPS.group, E_RECORD_ACTIONS.removeHard);
                this.showUserSort = _d.descriptor.canDo(E_ACTION_GROUPS.group, E_RECORD_ACTIONS.userOrder);
                this.showUserSortUp = _d.descriptor.canDo(E_ACTION_GROUPS.item, E_RECORD_ACTIONS.moveUp);
                this.showUserSortDown = _d.descriptor.canDo(E_ACTION_GROUPS.item, E_RECORD_ACTIONS.moveDown);

                this.fields = _d.descriptor.getFieldSet(E_FIELD_SET.fullSearch).map((fld) => Object.assign({}, fld, { value: null }));
            }
        });

        /* this._actionService.action$.subscribe((act) => {
            switch (act) {
                case E_RECORD_ACTIONS.markOne:
                console.log('markOne');
                    this.itemIsChecked = true;
                    break;
                case E_RECORD_ACTIONS.unmarkRecords:
                console.log('unmarkRecords');
                    this.itemIsChecked = false;
                    this.checkAll = false;
                    break;
                case E_RECORD_ACTIONS.markRecords:
                console.log('markRecords');
                    if (this.rootSelected) {
                        this.checkAll = true;
                        this.itemIsChecked = false;
                    } else {
                        this.itemIsChecked = true;
                    }
                    break;
                case E_RECORD_ACTIONS.markRoot:
                console.log('markRoot');
                    this.rootSelected = true;
                    this.itemIsChecked = true;
                    break;
                case E_RECORD_ACTIONS.unmarkRoot:
                console.log('unmarkRoot');
                    this.rootSelected = false;
                    break;
            }
        });*/
    }
    switchShowDeleted(value: boolean) {
        this._userSettingsService.saveShowDeleted(value);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public change(value: boolean): void {
        this.dropdownIsOpen = value;
      }

    deleteSelectedItems() {
        this._actionService.emitAction(E_RECORD_ACTIONS.remove);
    }

    editNode() {
        this._actionService.emitAction(E_RECORD_ACTIONS.edit);
    }

    nextItem(value: boolean) {
        if (value) {
            this._actionService.emitAction(E_RECORD_ACTIONS.navigateUp);
        } else {
            this._actionService.emitAction(E_RECORD_ACTIONS.navigateDown);
        }
    }

    physicallyDelete() {
        this._actionService.emitAction(E_RECORD_ACTIONS.removeHard);
    }

    restoringLogicallyDeletedItem() {
        this._actionService.emitAction(E_RECORD_ACTIONS.restore);
    }

    userSorting() {
        this.userSort = !this.userSort;
        this._actionService.emitAction(E_RECORD_ACTIONS.userOrder);
    }

    userSortingUp() {
        this._actionService.emitAction(E_RECORD_ACTIONS.moveUp);
    }

    userSortingDown() {
        this._actionService.emitAction(E_RECORD_ACTIONS.moveDown);
    }

    checkAllItems() {
        // console.log('checkAllItems');
        if (!this.checkAll/* && !this.itemIsChecked*/) {
            //  this.checkAll = true;
            this._actionService.emitAction(E_RECORD_ACTIONS.markRecords);
            this._actionService.emitAction(E_RECORD_ACTIONS.markRoot);
        } else {
            // this.checkAll = false;
            this.itemIsChecked = false;
            this._actionService.emitAction(E_RECORD_ACTIONS.unmarkRecords);
            this._actionService.emitAction(E_RECORD_ACTIONS.unmarkRoot);
        }
    }

    /* uncheckAllItems() {
        console.log('uncheckAllItems');
        this.checkAll = false;
        this.itemIsChecked = false;
        this._actionService.emitAction(E_RECORD_ACTIONS.unmarkRecords);
        this._actionService.emitAction(E_RECORD_ACTIONS.unmarkRoot);
    } */

    search(event) {
        if (event.keyCode === 13 && this.searchString) {
            this.dropdownIsOpen = false;
            this._dictionaryService.search(this.searchString, this.searchInAllDict);
        }
    }

    fullSearch() {
        this.modalRef.hide();
        this._dictionaryService.fullSearch(this.fields, this.searchInDeleted);
    }

    create() {
        this._editCardActionService.emitAction('create');
        this.creatingModal.hide();
    }

    saveNewNode(data: any) {
        console.log('Saving new node not implemented, data recived:', data);
        // this.dictionary.descriptor.getFieldView();
    }
}
