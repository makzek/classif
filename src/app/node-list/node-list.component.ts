import { Component, Input, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosMessageService } from '../services/eos-message.service';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { IMessage } from '../core/message.interface';
import {
    WARN_SEARCH_NOTFOUND,
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnDestroy {
    @Input() nodes: EosDictionaryNode[];

    modalRef: BsModalRef;
    private _dictionaryId: string;

    private _selectedNode: EosDictionaryNode;
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

    private _dropPageAtList = true;

    private _actionSubscription: Subscription;
    private _openedNodeSubscription: Subscription;
    private _dictionarySubscription: Subscription;
    private _selectedNodeSubscription: Subscription;
    private _searchResultSubscription: Subscription;
    private _userSettingsSubscription: Subscription;

    constructor(private _dictionaryService: EosDictService,
        private _orderService: EosDictOrderService,
        private _userSettingsService: EosUserSettingsService,
        private _messageService: EosMessageService,
        private modalService: BsModalService,
        private router: Router,
        private _actionService: NodeActionsService) {
        this._openedNodeSubscription = this._dictionaryService.openedNode$.subscribe((node) => this.openedNode = node);
        this._dictionarySubscription = this._dictionaryService.dictionary$.subscribe(
            (dictionary) => {
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                    this.viewFields = dictionary.descriptor.getFieldSet(E_FIELD_SET.list);
                    this.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                }
            },
            (error) => alert(error)
        );

        this._selectedNodeSubscription = this._dictionaryService.selectedNode$.subscribe((node) => {
            this._selectedNode = node;
            if (node) {
                if (node.children) {
                    this._update(node.children, true);
                } else {
                    this._update([], true);
                }
            }
        });

        this._searchResultSubscription = this._dictionaryService.searchResults$.subscribe((nodes) => {
            if (nodes.length) {
                this._update(nodes, false);
            } else if (this._selectedNode) {
                this._update(this._selectedNode.children, true);
            } else {
                this._update([], true);
            }
        });

        this._userSettingsSubscription = this._userSettingsService.settings.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this._actionSubscription = this._actionService.action$.subscribe((action) => {
            switch (action) {
                case E_RECORD_ACTIONS.edit: {
                    if (this.openedNode) {
                        this.editNode(this.openedNode);
                    } else {
                        this._actionService.emitAction(E_RECORD_ACTIONS.editSelected)
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

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
        this._dictionarySubscription.unsubscribe();
        this._selectedNodeSubscription.unsubscribe();
        this._searchResultSubscription.unsubscribe();
        this._userSettingsSubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
    }

    private _update(nodes: EosDictionaryNode[], hasParent: boolean) {
        this.nodes = nodes;
        this.hasParent = hasParent;
        if (nodes) {
            this.totalItems = nodes.length;
            if (nodes.length) {
                if (!this.hasParent) {
                    this._dictionaryService.openNode(this._dictionaryId, this.nodes[0].id);
                }
            }
            this._getListData(this.currentPage);
        }

    }

    checkAllItems(value: boolean): void {
        if (this.nodes) {
            for (const item of this.nodes) {
                item.selected = value;
            }
        }
    }

    checkItem(node: EosDictionaryNode) {
        /* tslint:disable:no-bitwise */
        if (node.selected) {
            if (!~this.nodes.findIndex((_n) => !_n.selected)) {
                this._actionService.emitAction(E_RECORD_ACTIONS.markAllChildren);
            } else {
                this._actionService.emitAction(E_RECORD_ACTIONS.markOne);
            }
        } else {
            if (!~this.nodes.findIndex((_n) => _n.selected)) {
                this._actionService.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
            } else {
                if (!!~this.nodes.findIndex((_n) => _n.selected)) {
                    this._actionService.emitAction(E_RECORD_ACTIONS.markOne);
                }
            }
        }
        /* tslint:enable:no-bitwise */
    }

    openFullInfo(node: EosDictionaryNode): void {
        if (!node.isDeleted) {
            if (node.id !== '') {
                this._dictionaryService.openNode(this._dictionaryId, node.id);
            }
        }
    }

    userSortItems(): void {
        this.nodeListPerPage.forEach((node, i) => {
            this.nodes.splice(i, 1, node);
        });
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
        if (this.userSorting) {

        } else {
            this._dictionaryService.openDictionary(this._dictionaryId);
        }
    }

    editNode(node: EosDictionaryNode) {
        if (node) {
            this.rememberCurrentURL();
            if (node.id.length && !node.isDeleted) {
                this.router.navigate([
                    'spravochniki',
                    this._dictionaryId,
                    node.id,
                    'edit',
                ]);
            } else {
                if (!node.id.length) {
                    this._messageService.addNewMessage(DANGER_EDIT_ROOT_ERROR);
                }
                if (node.isDeleted) {
                    this._messageService.addNewMessage(DANGER_EDIT_DELETED_ERROR);
                }
            }
        } else {
            this._messageService.addNewMessage(WARN_EDIT_ERROR);
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
                    if (1 !== 1) { // here must be API request for check if possible to delete
                        this._messageService.addNewMessage(DANGER_DELETE_ELEMENT);
                    } else {
                        const _deleteResult = this._dictionaryService.physicallyDelete(node.id);
                        if (_deleteResult) {
                            this.router.navigate([
                                'spravochniki',
                                this._dictionaryId,
                                node.parent.id,
                            ]);
                        } else {
                            this._messageService.addNewMessage(DANGER_DELETE_ELEMENT);
                        }
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

    private _getListData(page: number) {
        if (this.nodes && this.nodes.length) {
            this.nodeListPerPage = this.nodes.slice(
                (this.currentPage - 1) * this.itemsPerPage,
                this.currentPage * this.pageAtList * this.itemsPerPage
            );
        } else {
            this.nodeListPerPage = [];
        }
    }

    pageChanged(event: any): void {
        if (this._dropPageAtList) {
            this.pageAtList = 1;
            this.currentPage = event.page;
            this._getListData(event.page);
        }
        this._dropPageAtList = true;
    }

    showMore() {
        this._dropPageAtList = false;
        this.pageAtList++;
        this._getListData(this.currentPage);
        this.currentPage++;
        // console.log('currentPage', this.currentPage);
    }

    setItemCount(value: string) {
        this.itemsPerPage = +value;
        this._getListData(this.currentPage);
    }

    viewNode(node: EosDictionaryNode) {
        if (node) {
            this.rememberCurrentURL();
            if (node.id.length && !node.isDeleted) {
                this.router.navigate([
                    'spravochniki',
                    this._dictionaryId,
                    node.id,
                    'view',
                ]);
            }
        }
    }

    private rememberCurrentURL(): void {
        localStorage.setItem('viewCardUrlRedirect', this.router.url);
    }
}
