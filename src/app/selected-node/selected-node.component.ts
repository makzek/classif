import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../services/eos-message.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeListActionsService } from '../selected-node/node-list-action.service';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent {
    private _dictionaryId: string;
    dictionary: EosDictionary;
    selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;

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

        this._actionService.delete$.subscribe((res) => {
            if (res) {
                this.delete();
            }
        });

        this._actionService.edit$.subscribe((res) => {
            if (res && this.selectedNode.id === this.openedNode.id) {
                this.editNode();
            }
        });

        this._actionService.physicallyDelete$.subscribe((res) => {
            if (res) {
                this.physicallyDelete();
            }
        });

        this._actionService.restore$.subscribe((res) => {
            if (res) {
                this.restoringLogicallyDeletedItem();
            }
        });

        this._actionService.checkAll$.subscribe((res) => {
            if (res !== null) {
                this.selectedNode.selected = !res;
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
        this.router.navigate([
            'spravochniki',
            this._dictionaryId,
            this.selectedNode.id,
            'edit',
        ]);
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
                this._eosMessageService.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка удаления элемента: ',
                    msg: 'на этот объект (' + this.selectedNode.title + ') ссылаются другие объекты системы',
                });
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
}
