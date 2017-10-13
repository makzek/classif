import { Component, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosUserProfileService } from '../..//app/services/eos-user-profile.service';

import { EosDictionaryNode } from '../core/eos-dictionary-node';
import {
    DictionaryActionService,
    DICTIONARY_ACTIONS,
    DICTIONARY_STATES
} from '../dictionary/dictionary-action.service';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy {

    // public _selectedNode: EosDictionaryNode;
    public params: any = {
        sortable: false,
        showDeleted: false,
        hasParent: false
    };

    public _selectedNode: EosDictionaryNode;

    private _dictionaryId: string;
    private _nodeId: string;

    nodes: EosDictionaryNode[];
    // hideTree = true;
    // hideFullInfo = true;
    dictionaryName: string;

    currentState: number;
    readonly states = DICTIONARY_STATES;

    private _subscriptions: Subscription[];

    constructor(
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _actSrv: DictionaryActionService,
        private _profileSrv: EosUserProfileService,
    ) {
        this._route.params.subscribe((params) => {
            if (params) {
                this._dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._update();
            }
        });

        this.nodes = [];
        this._subscriptions = [];
        this._subscriptions.push(_dictSrv.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                if (dictionary.root) {
                    this.dictionaryName = dictionary.root.title;
                }
                this.nodes = [dictionary.root];
                this.params.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
            } else {
                this.nodes = [];
            }
        }));

        this._subscriptions.push(_actSrv.action$.subscribe((action) => {
            this._swichCurrentState(action);
        }));

        this._subscriptions.push(_profileSrv.settings$
            .map((settings) => settings.find((s) => s.id === 'showDeleted').value)
            .subscribe((s) => {
                this.params.showDeleted = s;
            })
        );

        this._subscriptions.push(this._dictSrv.selectedNode$.subscribe((node) => {
             this._selectedNode = node;
            /*
             if (node) {
                 this.viewFields = node.getListView();
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
                     this.checkState(node.marked);
                 }
             }
            */
         }));

        this.currentState = this._actSrv.state;

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
        this._actSrv.emitAction(null);
        this._actSrv.state = this.currentState;
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

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
        this._dictionarySubscription.unsubscribe();
        this._selectedNodeSubscription.unsubscribe();
        this._searchResultSubscription.unsubscribe();
        this._userSettingsSubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
    }

    private _update(nodes: EosDictionaryNode[], hasParent: boolean) {
        // this.params.hasParent = hasParent;
        if (this.nodes) {
            // this.nodes = nodes;
            if (this.nodes[0]) {
                this.sortableNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            }
            this.totalItems = this.nodes.length;
            if (this.nodes.length) {
                if (!this.params.hasParent) {
                    this._dictSrv.openNode(this.nodes[0].id);
                }
            }
            if (this.params.sortable) {
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

    userSortMoveUp(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        if (indexOfMoveItem !== 0) {
            const item  = this.nodeListPerPage[indexOfMoveItem - 1];
            this.nodeListPerPage[indexOfMoveItem - 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

    userSortMoveDown(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        const lastItem = this.nodeListPerPage.length - 1;
        if (lastItem !== indexOfMoveItem) {
            const item  = this.nodeListPerPage[indexOfMoveItem + 1];
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

    toggleItem(e) {
        // console.log(this.nodes);
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
        // Генерируем порядок
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
        // console.log('pageChanged fired', this._startPage, event.page); /
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
        // this._dictSrv.selectNode(this._dictionaryId, nodeId);
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
        // this._storageSrv.setItem(RECENT_URL, this._router.url.substring(0, this._router.url.lastIndexOf('/') + 1) + nodeId);
    }
    */
}
