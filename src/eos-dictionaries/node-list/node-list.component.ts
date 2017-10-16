import { Component, Input, OnDestroy, ViewChild, HostListener, OnInit } from '@angular/core';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { SortableComponent } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosStorageService } from '../../app/services/eos-storage.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnDestroy, OnInit {
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    // @Input() nodes: EosDictionaryNode[];
    nodes: EosDictionaryNode[];
    sortableNodes: EosDictionaryNode[];

    modalRef: BsModalRef;
    private _dictionaryId: string;

    _selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;
    nodeListPerPage: EosDictionaryNode[];

    totalItems: number;
    itemsPerPage = 10;

    currentPage = 1;

    hasParent = true;


    userSorting = false;

    private _params = {
        showCheckbox: false,
        showDeleted: false
    }
    private _startPage = 1;
    private _dropStartPage = true;

    private _actionSubscription: Subscription;
    private _openedNodeSubscription: Subscription;
    private _dictionarySubscription: Subscription;
    private _selectedNodeSubscription: Subscription;
    private _searchResultSubscription: Subscription;
    private _userSettingsSubscription: Subscription;

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _orderSrv: EosDictOrderService,
        private _profileSrv: EosUserProfileService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _actSrv: NodeActionsService,
    ) {
        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe((node) => this.openedNode = node);
        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe(
            (dictionary) => {
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                    this._params.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                }
            },
            (error) => alert(error)
        );

        this._selectedNodeSubscription = this._dictSrv.selectedNode$.subscribe((node) => {
            this._selectedNode = node;
            if (node) {
                this._update(node.children, true);
                if (!this.nodes) {
                    if (node.marked) {
                        this._actSrv.emitAction(E_RECORD_ACTIONS.markAllChildren);
                        this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
                    } else {
                        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
                        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
                    }
                } else {
                    this.checkState();
                }
            }
        });

        this._searchResultSubscription = this._dictSrv.searchResults$.subscribe((nodes) => {
            if (nodes.length) {
                this._update(nodes, false);
            } else if (this._selectedNode) {
                this._update(this._selectedNode.children, true);
            } else {
                this._update([], true);
            }
        });

        this._userSettingsSubscription = this._profileSrv.settings$.subscribe((res) => {
            this._params.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this._actionSubscription = this._actSrv.action$.subscribe((action) => {
            switch (action) {
                case E_RECORD_ACTIONS.edit: {
                    if (this.openedNode) {
                        this.editNode(this.openedNode);
                    } else {
                        this._actSrv.emitAction(E_RECORD_ACTIONS.editSelected)
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
                // case E_RECORD_ACTIONS.restore: {
                case E_RECORD_ACTIONS.showDeleted: {
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

    ngOnInit() {
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
        this.hasParent = hasParent;
        if (nodes) {
            this.nodes = nodes;
            if (this.nodes[0]) {
                this.nodes.sort(this._orderSrv.defaultSort);
                this.sortableNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            }
            this.totalItems = nodes.length;
            if (nodes.length) {
                if (!this.hasParent) {
                    this._dictSrv.openNode(this.nodes[0].id);
                }
            }
            if (this.userSorting) {
                this._getListData(this.sortableNodes);
            } else {
                this._getListData(this.nodes);
            }

        } else {
            this.nodes = null;
        }
    }

    checkAllItems(value: boolean): void {
        if (this.nodes) {
            for (const item of this.nodes) {
                item.marked = value;
            }
        }
        this._selectedNode.marked = value;
    }

    openFullInfo(node: EosDictionaryNode): void {
        if (!node.isDeleted) {
            if (node.id !== '') {
                this._dictSrv.openNode(node.id);
            }
        }
    }

    private userSortMoveUp(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        if (indexOfMoveItem !== 0) {
            const item  = this.nodeListPerPage[indexOfMoveItem - 1];
            this.nodeListPerPage[indexOfMoveItem - 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

     private userSortMoveDown(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        const lastItem = this.nodeListPerPage.length - 1;
        if (lastItem !== indexOfMoveItem) {
            const item  = this.nodeListPerPage[indexOfMoveItem + 1];
            this.nodeListPerPage[indexOfMoveItem + 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

    private toggleUserSort(): void {
        this.userSorting = !this.userSorting;
        if (this.userSorting) {
            this.sortableNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
        }
    }

    private toggleItem(): void {
        const from = (this.currentPage - 1) * this.itemsPerPage;
        let before = this.currentPage * this.itemsPerPage - 1;
        if (before > this.sortableNodes.length) {
            before = this.sortableNodes.length - 1;
        }
        if (this.sortableNodes[0]) {
            for (let i = from, j = 0; i <= before; i++, j++ ) {
                this.sortableNodes[i] = this.nodeListPerPage[j];
            }
        }
        this._orderSrv.generateOrder(this.sortableNodes, this.nodes[0].parentId);
    }

    editNode(node: EosDictionaryNode) {
        if (node) {
            this._rememberCurrentURL();
            if (!node.data.PROTECTED && !node.isDeleted) {
                this._router.navigate([
                    'spravochniki',
                    this._dictionaryId,
                    node.id,
                    'edit',
                ]);
            } else {
                if (node.data.PROTECTED) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
                }

                if (node.isDeleted) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
                }
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }
    }

    deleteSelectedItems(): void {
        const selectedNodes: string[] = [];
        if (this.nodes) {
            this.nodes.forEach((child) => {
                if (child.marked && !child.isDeleted) {
                    selectedNodes.push(child.id);
                    child.marked = false;
                }
            });
        }
        this._dictSrv.deleteSelectedNodes(this._dictionaryId, selectedNodes);
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
                this._dictSrv.openNode(this.nodes[(i - 1 +
                    this.nodes.length) % this.nodes.length].id);
                this.currentPage = Math.floor(((i - 1 + this.nodes.length)
                    % this.nodes.length) / (this.itemsPerPage)) + 1;
            } else {
                this._dictSrv.openNode(this.nodes[(i + 1 +
                    this.nodes.length) % this.nodes.length].id);
                this.currentPage = Math.floor(((i + 1 + this.nodes.length)
                    % this.nodes.length) / (this.itemsPerPage)) + 1;
            }
        }
    }

    physicallyDelete() {
        if (this.nodes) {
            this.nodes.forEach(node => {
                if (node.marked) {
                    if (1 !== 1) { // here must be API request for check if possible to delete
                        this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                    } else {
                        const _deleteResult = this._dictSrv.physicallyDelete(node.id);
                        if (_deleteResult) {
                            this._router.navigate([
                                'spravochniki',
                                this._dictionaryId,
                                node.parent.id,
                            ]);
                        } else {
                            this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                        }
                    }
                }
            });
        }
    }

    restoringLogicallyDeletedItem() {
        if (this.nodes) {
            this.nodes.forEach(child => {

                if (child.marked && child.isDeleted) {
                    this._dictSrv.restoreItem(child);
                }
            });
        }
    }

    private _getListData(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.nodeListPerPage = nodes.slice(
                (this._startPage - 1) * this.itemsPerPage,
                this.currentPage * this.itemsPerPage
            );
        } else {
            this.nodeListPerPage = [];
        }
    }

    pageChanged(event: any): void {
        if (this._dropStartPage) {
            this._startPage = event.page;
        }
        this.currentPage = event.page;
        /* console.log('pageChanged fired', this._startPage, event.page); */
        if (this.userSorting) {
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
        }
        this._dropStartPage = true;
    }

    showMore() {
        this._dropStartPage = false;
        this.currentPage++;
    }

    setItemCount(value: string) {
        this.itemsPerPage = +value;
        this._startPage = this.currentPage;
        if (this.userSorting) {
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
        }
    }

    viewNode(node: EosDictionaryNode) {
        if (node) {
            this._rememberCurrentURL();
            if (!this._dictSrv.isRoot(node.id)) {
                this._router.navigate([
                    'spravochniki',
                    this._dictionaryId,
                    node.id,
                    'view',
                ]);
            }
        }
    }

    private _rememberCurrentURL(): void {
        // const url = this._router.url.substring(0, this._router.url.lastIndexOf('/') + 1) + this._selectedNode.id;
        const url = this._router.url;
        this._storageSrv.setItem(RECENT_URL, url);
    }

    private checkState() {
        let checkAllFlag = true,
            checkSome = false;
        if (this.nodes) {
            for (const item of this.nodes) {
                if (item.marked) {
                    checkSome = true;
                }
                checkAllFlag = checkAllFlag && item.marked;
            }
            checkAllFlag = checkAllFlag && this._selectedNode.marked;
            if (this._selectedNode.marked) {
                checkSome = true;
            }
        } else {
            if (!this._selectedNode.marked) {
                checkAllFlag = false;
                checkSome = false;
            }
        }

        if (checkAllFlag) {
            this._actSrv.emitAction(E_RECORD_ACTIONS.markAllChildren);
            this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
        } else if (checkSome) {
            this._actSrv.emitAction(E_RECORD_ACTIONS.markOne);
        } else if (!checkAllFlag) {
            this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
            this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
        }
    }

    goUp() {
        /* this._dictSrv.selectNode(this._dictionaryId, nodeId); */
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
        // this._storageSrv.setItem(RECENT_URL, this._router.url.substring(0, this._router.url.lastIndexOf('/') + 1) + nodeId);
    }
}


