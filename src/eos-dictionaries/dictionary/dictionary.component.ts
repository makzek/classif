import { Component, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosUserProfileService } from '../..//app/services/eos-user-profile.service';
import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';

import { NodeActionsService } from '../node-actions/node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

import {
    DictionaryActionService,
    DICTIONARY_ACTIONS,
    DICTIONARY_STATES
} from '../dictionary/dictionary-action.service';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { RECENT_URL } from '../../app/consts/common.consts';
import { IListPage } from '../node-list-pagination/node-list-pagination.component';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy {

    // public _selectedNode: EosDictionaryNode;
    public params: any;

    public _selectedNode: EosDictionaryNode;

    public _dictionaryId: string;
    private _nodeId: string;

    treeNodes: EosDictionaryNode[];
    listNodes: EosDictionaryNode[];
    visibleNodes: EosDictionaryNode[];

    /// pages
    nodeListPerPage: EosDictionaryNode[];
    totalItems: number;
    itemsPerPage = 10;
    currentPage = 1;
    private _startPage = 1;
    private _dropStartPage = true;

    // hideTree = true;
    // hideFullInfo = true;
    dictionaryName: string;

    currentState: number;
    readonly states = DICTIONARY_STATES;

    private _subscriptions: Subscription[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        /* remove unused */
        private _actSrv: DictionaryActionService,
    ) {

        this.params = {
            sortable: false,
            showDeleted: false,
            hasParent: false
        };

        this.listNodes = [];
        this.nodeListPerPage = [];
        this._subscriptions = [];
        this.treeNodes = [];
        this.visibleNodes = [];
        this.currentState = this._actSrv.state;

        this._subscriptions.push(this._route.params.subscribe((params) => {
            if (params) {
                this._dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._update();
            }
        }));

        this._subscriptions.push(_dictSrv.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                if (dictionary.root) {
                    this.dictionaryName = dictionary.root.title;
                }
                this.treeNodes = [dictionary.root];
                this.params.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
            } else {
                this.treeNodes = [];
            }
        }));

        this._subscriptions.push(_actSrv.action$.subscribe((action) => {
            this._swichCurrentState(action); // ??????????????????
        }));

        this._subscriptions.push(_profileSrv.settings$
            .map((settings) => settings.find((s) => s.id === 'showDeleted').value)
            .subscribe((s) => {
                this.params.showDeleted = s;
            })
        );

        this._subscriptions.push(this._dictSrv.selectedNode$.subscribe((node) => {
            this._selectedNode = node;
            if (node) {
                this.listNodes = node.children;
                this._getVisibleNodes();
            }

            /*
             if (node) {
                 this.viewFields = node.getListView();
                 this._update(node.children, true);
                 if (!this.listNodes) {
                     if (node.marked) {
                         this._actSrv.emitAction(E_RECORD_ACTIONS.markAllChildren);
                         this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
                     } else {
                         this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
                         this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
                     }
                 } else {
                     this.checkState(node.marked);
                 }
             }
            */
        }));
    }

    private _getVisibleNodes() {
        this.visibleNodes = this.listNodes;
    }

    pageChanged(page: IListPage) {
        this.visibleNodes = this.listNodes.slice((page.start - 1) * page.length, page.current * page.length);
    }
    doAction(action: E_RECORD_ACTIONS) {
        console.log('alarmaaaa!!!', action);
    }

    onClick() {
        if (window.innerWidth <= 1500) {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
            this._actSrv.closeAll = true;
        }
    }

    private _swichCurrentState(action: DICTIONARY_ACTIONS) {
        this._actSrv.closeAll = false;
        switch (action) {
            // TODO: try to find more simple solition
            case DICTIONARY_ACTIONS.closeTree:
                switch (this.currentState) {
                    case DICTIONARY_STATES.full:
                        this.currentState = DICTIONARY_STATES.info;
                        break;
                    case DICTIONARY_STATES.tree:
                        this.currentState = DICTIONARY_STATES.selected;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.openTree:
                switch (this.currentState) {
                    case DICTIONARY_STATES.info:
                        this.currentState = DICTIONARY_STATES.full;
                        break;
                    case DICTIONARY_STATES.selected:
                        this.currentState = DICTIONARY_STATES.tree;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.closeInfo:
                switch (this.currentState) {
                    case DICTIONARY_STATES.full:
                        this.currentState = DICTIONARY_STATES.tree;
                        break;
                    case DICTIONARY_STATES.info:
                        this.currentState = DICTIONARY_STATES.selected;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.openInfo:
                switch (this.currentState) {
                    case DICTIONARY_STATES.tree:
                        this.currentState = DICTIONARY_STATES.full;
                        break;
                    case DICTIONARY_STATES.selected:
                        this.currentState = DICTIONARY_STATES.info;
                        break;
                }
                break;
        }
    }

    private _update() {
        if (this._dictionaryId) {
            this._dictSrv.openDictionary(this._dictionaryId)
                .then(() => {
                    this._dictSrv.selectNode(this._nodeId);
                });
        }
    }

    ngOnDestroy() {
        this._subscriptions.forEach((_s) => _s.unsubscribe());
    }

    /*
        node-list methods
        --------
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
                if (!this.listNodes) {
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

        this._searchResultSubscription = this._dictSrv.searchResults$.subscribe((listNodes) => {
            if (listNodes.length) {
                this._update(listNodes, false);
            } else if (this._selectedNode) {
                this._update(this._selectedNode.children, true);
            } else {
                this._update([], true);
            }
        });

        this._userSettingsSubscription = this.position_profileSrv.settings$.subscribe((res) => {
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

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
        this._dictionarySubscription.unsubscribe();
        this._selectedNodeSubscription.unsubscribe();
        this._searchResultSubscription.unsubscribe();
        this._userSettingsSubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
    }
    */

    private _update_(nodes: EosDictionaryNode[], hasParent: boolean) {
        // this.params.hasParent = hasParent;
        if (this.listNodes) {
            // this.listNodes = nodes;
            if (this.listNodes[0]) {
                // this.sortableNodes = this._orderSrv.getUserOrder(this.listNodes, this.listNodes[0].parentId);
            }
            // this.totalItems = this.listNodes.length;
            if (this.listNodes.length) {
                if (!this.params.hasParent) {
                    this._dictSrv.openNode(this.listNodes[0].id);
                }
            }
            if (this.params.sortable) {
                // this._getListData(this.sortableNodes);
            } else {
                this._getListData(this.listNodes);
            }

        } else {
            this.listNodes = [];
        }
    }

    checkAllItems(value: boolean): void {
        if (this.listNodes) {
            for (const item of this.listNodes) {
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


    editNode(node: EosDictionaryNode) {
        if (node) {
            this._rememberCurrentURL();
            if (node.data.PROTECTED) {
                this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else if (node.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
            } else /*(!node.data.PROTECTED && !node.isDeleted) */ {
                const _path = this._dictSrv.getNodePath(node);
                _path.push('edit');
                this._router.navigate(_path);
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }
    }

    deleteSelectedItems(): void {
        const selectedNodes: string[] = [];
        if (this.listNodes) {
            this.listNodes.forEach((child) => {
                if (child.marked && !child.isDeleted) {
                    selectedNodes.push(child.id);
                    child.marked = false;
                }
            });
        }
        this._dictSrv.deleteSelectedNodes(this._dictionaryId, selectedNodes);
    }

    physicallyDelete() {
        if (this.listNodes) {
            this.listNodes.forEach(node => {
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
        /* todo: implemend with API call */
        if (this.listNodes) {
            this.listNodes.forEach(child => {
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


    setItemCount(value: string) {
        this.itemsPerPage = +value;
        this._startPage = this.currentPage;
        if (this.params.sortable) {
            // this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.listNodes);
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
        const url = this._router.url;
        this._storageSrv.setItem(RECENT_URL, url);
    }

    private checkState() {
        let checkAllFlag = true,
            checkSome = false;
        if (this.listNodes) {
            for (const item of this.listNodes) {
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
            // this._actSrv.emitAction(E_RECORD_ACTIONS.markAllChildren);
            // this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
        } else if (checkSome) {
            // this._actSrv.emitAction(E_RECORD_ACTIONS.markOne);
        } else if (!checkAllFlag) {
            // this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
            // this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
        }
    }

    goUp() {
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
    }
}
