import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeListActionsService } from '../selected-node/node-list-action.service';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent {
    showDeleted = false;
    modalRef: BsModalRef;
    checkAll = false;
    newNode: EosDictionaryNode;

    searchResults: EosDictionaryNode[];
    searchString: string;
    searchInAllDict = false;

    dictionary: EosDictionary;

    constructor(private _userSettingsService: EosUserSettingsService,
        private modalService: BsModalService,
        private _dictionaryService: EosDictService,
        private _actionService: NodeListActionsService) {
        this._userSettingsService.settings.subscribe((res) => {
                this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
            });
        this._dictionaryService.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
        });
    }
    switchShowDeleted(value: boolean) {
        this._userSettingsService.saveShowDeleted(value);
    }

    openCreatingForm(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    createItem() {
        this.modalRef.hide();
        this._dictionaryService.addChild(this.newNode);
        this.newNode = new EosDictionaryNode(this.dictionary.descriptor.record, {
            id: null,
            code: null,
            title: null,
            parentId: null,
            parent: null,
            children: [],
            description: null,
            isNode: null,
            hasSubnodes: null,
            isExpanded: null,
            isDeleted: false,
            selected: false,
            data: null,
        });
    }

    deleteSelectedItems() {
        this._actionService.emitDelete();
    }

    editNode() {
        this._actionService.emitEdit();
    }

    nextItem (value: boolean) {
        this._actionService.emitNextItem(value);
    }

    physicallyDelete() {
        this._actionService.emitPhysicallyDelete();
    }

    restoringLogicallyDeletedItem() {
        this._actionService.emitRestore();
    }

    checkAllItems() {
        this._actionService.emitCheckAll(this.checkAll);
    }

    search() {
        this._dictionaryService.search(this.searchString, this.searchInAllDict);
    }
}
