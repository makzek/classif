import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosMessageService } from '../services/eos-message.service';
import { NodeListActionsService } from '../selected-node/node-list-action.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent {
    @Input() nodes: EosDictionaryNode[];

    modalRef: BsModalRef;
    private _dictionaryId: string;

    openedNode: EosDictionaryNode;
    nodeListPerPage: EosDictionaryNode[];
    viewFields: FieldDescriptor[];

    totalItems: number;
    itemsPerPage = 10;

    currentPage = 1;
    pageAtList = 1;
    showDeleted: boolean;

    hasParent = true;
    showCheckbox: boolean;

    userSorting = false;

    constructor(private _dictionaryService: EosDictService,
        private _userSettingsService: EosUserSettingsService,
        private _messageService: EosMessageService,
        private modalService: BsModalService,
        private router: Router,
        private _actionService: NodeListActionsService) {
        this._dictionaryService.openedNode$.subscribe((node) => {
            this.openedNode = node;
        });

        this._dictionaryService.dictionary$.subscribe(
            (dictionary) => {
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                    this.viewFields = dictionary.descriptor.listFields;
                    this.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                }
            },
            (error) => alert(error)
        );
        this._dictionaryService.selectedNode$.subscribe((node) => {
            if (node) {
                this._update(node.children, true);
            }
        });
        this._dictionaryService.searchResults$.subscribe((nodes) => {
            if (nodes.length) {
                this._update(nodes, false);
            }
        });

        this._userSettingsService.settings.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this._actionService.action$.subscribe((action) => {
            switch (action) {
                case E_RECORD_ACTIONS.edit: {
                    if (this.openedNode) {
                        this.editNode(this.openedNode);
                    }
                    break;
                }
                case E_RECORD_ACTIONS.remove: {
                    this.deleteSelectedItems();
                    break;
                }
                case E_RECORD_ACTIONS.navigateDown: {
                    this.nextItem(false);
                    break;
                }
                case E_RECORD_ACTIONS.navigateUp: {
                    this.nextItem(true);
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
                    this.checkAllItems(true);
                    break;
                }
                case E_RECORD_ACTIONS.unmarkRecords: {
                    this.checkAllItems(false);
                    break;
                }
                case E_RECORD_ACTIONS.userOrder: {
                    this.toggleUserSort();
                    break;
                }
                case E_RECORD_ACTIONS.moveUp: {
                    this.userSortMoveUp();
                    break;
                }
                case E_RECORD_ACTIONS.moveDown: {
                    this.userSortMoveDown();
                    break;
                }
            }
        });
    }

    private _update(nodes: EosDictionaryNode[], hasParent: boolean) {
        this.nodes = nodes;
        this.hasParent = hasParent;
        if (nodes) {
            this.totalItems = nodes.length;
            if (nodes.length) {
                this.nodeListPerPage = this.nodes.slice(0, this.itemsPerPage);
                if (!this.hasParent) {
                    this._dictionaryService.openNode(this._dictionaryId, this.nodes[0].id);
                }
            }
        }

    }

    checkAllItems(value: boolean): void {
        if (this.nodes) {
            for (const item of this.nodes) {
                item.selected = value;
            }
        }
    }

    openFullInfo(node: EosDictionaryNode): void {
        if (!node.isDeleted) {
            if (node.id !== '') {
                this._dictionaryService.openNode(this._dictionaryId, node.id);
            }
        }
    }

    userSortItems(): void {
        this._dictionaryService.userOrder(this.nodes);
    }

    userSortMoveUp(): void {
        this._dictionaryService.userOrderMoveUp(this.nodes);
    }

    userSortMoveDown(): void {
        this._dictionaryService.userOrderMoveDown(this.nodes);
    }

    toggleUserSort(): void {
        this.userSorting = !this.userSorting;
    }

    editNode(node: EosDictionaryNode) {
        if (node) {
            if (node.id.length && !node.isDeleted) {
                this.router.navigate([
                    'spravochniki',
                    this._dictionaryId,
                    node.id,
                    'edit',
                ]);
            }
        } else {
            this._messageService.addNewMessage({
                type: 'warning',
                title: 'Ошибка редактирования: ',
                msg: 'не выбран элемент для редактирования'
            });
        }
    }

    deleteSelectedItems(): void {
        const selectedNodes: string[] = [];
        if (this.nodes) {
            this.nodes.forEach((child) => {
                if (child.selected && !child.isDeleted) {
                    selectedNodes.push(child.id);
                    child.selected = false;
                }
            });
        }
        this._dictionaryService.deleteSelectedNodes(this._dictionaryId, selectedNodes);
    }

    nextItem(goBack: boolean): void {
        let i = 0;
        for (const node of this.nodes) {
            if (node.id === this.openedNode.id) {
                break;
            }
            i++;
        }
        if (i < this.nodes.length) {
            if (goBack) {
                this._dictionaryService.openNode(this._dictionaryId, this.nodes[(i - 1 +
                    this.nodes.length) % this.nodes.length].id);
                this.currentPage = Math.floor(((i - 1 + this.nodes.length)
                    % this.nodes.length) / (this.itemsPerPage)) + 1;
            } else {
                this._dictionaryService.openNode(this._dictionaryId, this.nodes[(i + 1 +
                    this.nodes.length) % this.nodes.length].id);
                this.currentPage = Math.floor(((i + 1 + this.nodes.length)
                    % this.nodes.length) / (this.itemsPerPage)) + 1;
            }
        }
    }

    physicallyDelete() {
        if (this.nodes) {
            this.nodes.forEach(node => {
                if (node.selected) {
                    if (node.title.length % 3) { // here must be API request for check if possible to delete
                        this._messageService.addNewMessage({
                            type: 'danger',
                            title: 'Ошибка удаления элемента: ',
                            msg: 'на этот объект ссылаются другие объекты системы',
                        });
                    } else {
                        this._dictionaryService.physicallyDelete(node.id);
                    }
                }
            });
        }
    }

    restoringLogicallyDeletedItem() {
        if (this.nodes) {
            this.nodes.forEach(child => {
                if (child.selected && child.isDeleted) {
                    this._dictionaryService.restoreItem(child);
                }
            });
        }
    }

    pageChanged(event: any): void {
        this.pageAtList = 1;
        this.nodeListPerPage = this.nodes.slice((event.page - 1)
            * event.itemsPerPage, event.page * event.itemsPerPage);
    }

    showMore() {
        this.pageAtList++;
        this.nodeListPerPage = this.nodes.slice((this.currentPage - 1)
            * this.itemsPerPage, this.currentPage * this.itemsPerPage * this.pageAtList);
        this.currentPage++;
    }

    setItemCount(value: string) {
        this.itemsPerPage = +value;
        this.nodeListPerPage = this.nodes.slice((this.currentPage - 1) * +value, this.currentPage * +value);
    }
}
