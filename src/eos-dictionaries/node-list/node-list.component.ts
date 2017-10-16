import { Component, Input, OnInit, OnDestroy, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SortableComponent } from 'ngx-bootstrap';
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
export class NodeListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() nodes: EosDictionaryNode[];
    @Input() params: any;
    @Output() change: EventEmitter<any> = new EventEmitter<any>(); // changes in list

    @ViewChild(SortableComponent) sortableComponent: SortableComponent;

    // nodeList: EosDictionaryNode[];

    //    private _dictionaryId: string;

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
    ) { }

    ngOnInit() {
        this._update();
    }

    ngOnChanges() {
        this._update();
    }
    ngOnDestroy() { }

    private _getListData(nodes: EosDictionaryNode[]) {
    }

    private _update() {
        /*
        if (this.nodes) {
            if (this.params.sortable && this.nodes.length) {
                this.nodeList = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            } else {
                this.nodeList = this.nodes;
            }
        } else {
            this.nodeList = [];
        }
        */
    }

    checkState() {
        this.change.emit();
    }

    toggleItem(e) {
        console.log('sort toggle', e);
        // console.log(this.nodes);
        /*
        const from = (this.currentPage - 1) * this.itemsPerPage;
        let before = this.currentPage * this.itemsPerPage - 1;
        if (before > this.sortableNodes.length) {
            before = this.sortableNodes.length - 1;
        }
        */
        if (this.nodes.length) {
            /*
            for (let i = from, j = 0; i <= before; i++ , j++) {
                this.sortableNodes[i] = this.nodeListPerPage[j];
            }
            */
            // Генерируем порядок
            this._orderSrv.generateOrder(this.nodes, this.nodes[0].parentId);
        }
    }

    /*
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

    userSortMoveUp(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        if (indexOfMoveItem !== 0) {
            const item = this.nodeListPerPage[indexOfMoveItem - 1];
            this.nodeListPerPage[indexOfMoveItem - 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

    userSortMoveDown(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        const lastItem = this.nodeListPerPage.length - 1;
        if (lastItem !== indexOfMoveItem) {
            const item = this.nodeListPerPage[indexOfMoveItem + 1];
            this.nodeListPerPage[indexOfMoveItem + 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

    toggleUserSort(): void {
        this.params.sortable = !this.params.sortable;
        if (this.params.sortable) {
            this.sortableNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
        }
    }

    /*
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

    restoringLogicallyDeletedItem() {
        if (this.nodes) {
            this.nodes.forEach(child => {

                if (child.marked && child.isDeleted) {
                    this._dictSrv.restoreItem(child);
                }
            });
        }
    }

    pageChanged(event: any): void {
        if (this._dropStartPage) {
            this._startPage = event.page;
        }
        this.currentPage = event.page;
        // console.log('pageChanged fired', this._startPage, event.page);
        if (this.params.sortable) {
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
        if (this.params.sortable) {
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
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
        // this._dictSrv.selectNode(this._dictionaryId, nodeId);
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
        // this._storageSrv.setItem(RECENT_URL, this._router.url.substring(0, this._router.url.lastIndexOf('/') + 1) + nodeId);
    }
    */
}


