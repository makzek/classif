import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../services/eos-message.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import {
    DANGER_EDIT_ERROR,
    DANGER_DELETE_ELEMENT
} from '../core/messages.const';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent {
    private _dictionaryId: string;
    dictionary: EosDictionary;
    selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;
    viewFields: FieldDescriptor[];

    showDeleted = false;

    constructor(private _eosDictService: EosDictService,
        private _eosMessageService: EosMessageService,
        private router: Router,
        private _eosUserSettingsService: EosUserSettingsService,
        private _actionService: NodeListActionsService) {
        this._eosDictService.dictionary$.subscribe(
            (dictionary) => {
                this.dictionary = dictionary;
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                    this.viewFields = dictionary.descriptor.getFieldSet(E_FIELD_SET.list);
                }
            },
            (error) => alert(error)
        );
        this._eosDictService.selectedNode$.subscribe(
            (node) => {
                this.selectedNode = node;
                if (node) {
                    // Uncheck all checboxes before changing selectedNode
                    // if (this.selectedNode) {
                    // this.checkAllItems(false); //No! When go from edit checked elements stay unchecked
                    // }

                    this.openFullInfo(node);
                } else {
                    if (this.dictionary) {
                        this.selectedNode = this.dictionary.root;
                    }
                }
            },
            (error) => alert(error)
        );
        this._eosDictService.openedNode$.subscribe(
            (node) => {
                this.openedNode = node;
                if (!this.openedNode && this.dictionary) {
                    this.openedNode = this.dictionary.root;
                }
            },
            (error) => alert(error)
        );

        this._eosUserSettingsService.settings.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this._actionService.action$.subscribe((action) => {
            switch (action) {
                case E_RECORD_ACTIONS.remove: {
                    this.delete();
                    break;
                }
                case E_RECORD_ACTIONS.editSelected: {
                    this.editNode();
                    break;
                }
                case E_RECORD_ACTIONS.removeHard: {
                    this.physicallyDelete();
                    break;
                }
                case E_RECORD_ACTIONS.restore: {
                    this.restoringLogicallyDeletedItem();
                    break;
                }
                case E_RECORD_ACTIONS.markRecords: {
                    this.selectedNode.selected = true;
                    break;
                }
                case E_RECORD_ACTIONS.unmarkRecords: {
                    this.selectedNode.selected = false;
                    break;
                }
            }
        });
    }

    openFullInfo(node: EosDictionaryNode): void {
        if (!node.isDeleted) {
            if (node.id !== '') {
                this._eosDictService.openNode(this._dictionaryId, node.id);
            }
        }
    }

    editNode() {
        if (this.selectedNode.id.length) {
            this.router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.id,
                'edit',
            ]);
        } else {
            this._eosMessageService.addNewMessage(DANGER_EDIT_ERROR);
        }
    }

    selectNode(nodeId: string) {
        this._eosDictService.selectNode(this._dictionaryId, nodeId);
    }

    delete() {
        if (this.selectedNode.selected) {
            this.selectedNode.selected = false;
            this._eosDictService.deleteSelectedNodes(this._dictionaryId, [this.selectedNode.id]);
            this.router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.parent.id,
            ]);
        };
    }

    physicallyDelete() {
        if (this.selectedNode.selected) {
            if (this.selectedNode.title.length % 3) { // here must be API request for check if possible to delete
                this._eosMessageService.addNewMessage(DANGER_DELETE_ELEMENT);
            } else {
                this._eosDictService.physicallyDelete(this.selectedNode.id);
            }
        }
    }

    restoringLogicallyDeletedItem() {
        if (this.selectedNode.selected && this.selectedNode.isDeleted) {
            this._eosDictService.physicallyDelete(this.selectedNode.id);
        }
    }

    mark() {
        if (this.selectedNode.selected) {
            this._actionService.emitAction(E_RECORD_ACTIONS.markRoot);
        } else {
            this._actionService.emitAction(E_RECORD_ACTIONS.unmarkRoot);
        }
    }

    viewNode() {
        if (this.selectedNode.id.length) {
            this.router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.id,
                'view',
            ]);
        }
    }
}
