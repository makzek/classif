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
    private _openedNode: EosDictionaryNode;

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

    ngOnDestroy() {
        this._subscriptions.forEach((_s) => _s.unsubscribe());
    }


    private _getVisibleNodes() {
        this.visibleNodes = this.listNodes;
    }

    pageChanged(page: IListPage) {
        this.visibleNodes = this.listNodes.slice((page.start - 1) * page.length, page.current * page.length);
    }
    doAction(action: E_RECORD_ACTIONS) {
        switch (action) {
            case E_RECORD_ACTIONS.navigateDown: {
                this.openNodeNavigate(false);
                break;
            }
            case E_RECORD_ACTIONS.navigateUp: {
                this.openNodeNavigate(true);
                break;
            }
            case E_RECORD_ACTIONS.edit: {
                this._editNode();
                break;
            }
            /*
            case E_RECORD_ACTIONS.remove: {
                this.deleteSelectedItems();
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
            */
            default:
                console.log('alarmaaaa!!! unhandled', E_RECORD_ACTIONS[action]);
        }
    }

    onClick() {
        if (window.innerWidth <= 1500) {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
        }
    }

    private _swichCurrentState(action: DICTIONARY_ACTIONS) {
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

    openNodeNavigate(backward = false): void {
        let _idx = this.visibleNodes.findIndex((node) => node.isSelected);
        if (_idx < 0) {
            _idx = 0;
        }

        if (backward) {
            _idx--;
        } else {
            _idx++;
        }
        _idx = (_idx + this.visibleNodes.length) % this.visibleNodes.length;

        this._dictSrv.openNode(this.visibleNodes[_idx].id);
    }

    goUp() {
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
    }

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


    private _editNode() {
        const node = this.visibleNodes.find((n) => n.isSelected || n.isActive);
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

    private _toggleUserSort(): void {
        this.params.sortable = !this.params.sortable;
        if (this.params.sortable) {
            // this.visibleNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            // this._getListData(this.sortableNodes);
        } else {
            // this._getListData(this.nodes);
        }
    }

    /*
switchUserSort() {
    this._actSrv.emitAction(E_RECORD_ACTIONS.userOrder);
}
*/
    /*
    checkAllItems() {
        if (this.checkAll) {
            this.rootSelected = true;
            this.allChildrenSelected = true;
            this.itemIsChecked = false;
            this._actSrv.emitAction(E_RECORD_ACTIONS.markRecords);
        } else {
            this.itemIsChecked = false;
            this.allChildrenSelected = false;
            this.someChildrenSelected = false;
            this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRecords);
        }
    }
    */
    /*
    uncheckAllItems() {
        this.checkAll = false;
        this.itemIsChecked = false;
        this.allChildrenSelected = false;
        this.someChildrenSelected = false;
        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRecords);
    }
    */
    /*
    create(hide = true) {
        // this._editActSrv.emitAction(EDIT_CARD_ACTIONS.create);
        this._dictSrv.addNode(this.newNodeData)
            .then((node) => {
                console.log('created node', node);
                let title = '';
                node.getShortQuickView().forEach((_f) => {
                    title += this.newNodeData[_f.key];
                });
                const bCrumbs = this._breadcrumbsSrv.getBreadcrumbs();
                let path = '';
                for (const bc of bCrumbs) {
                    path = path + bc.title + '/';
                }
                this._deskSrv.addRecentItem({
                    link: this._dictSrv.getNodePath(node.id).join('/'),
                    title: title,
                    fullTitle: path + title
                });
                if (hide) {
                    this.creatingModal.hide();
                }
                this.newNodeData = {};
            });
    }

    cancelCreate() {
        this.creatingModal.hide();
    }
    */
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

    private userSortMoveUp(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        if (indexOfMoveItem !== 0) {
            const item = this.nodeListPerPage[indexOfMoveItem - 1];
            this.nodeListPerPage[indexOfMoveItem - 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

     private userSortMoveDown(): void {
        const indexOfMoveItem = this.nodeListPerPage.indexOf(this.openedNode);
        const lastItem = this.nodeListPerPage.length - 1;
        if (lastItem !== indexOfMoveItem) {
            const item = this.nodeListPerPage[indexOfMoveItem + 1];
            this.nodeListPerPage[indexOfMoveItem + 1] = this.nodeListPerPage[indexOfMoveItem];
            this.nodeListPerPage[indexOfMoveItem] = item;
        }
        this.sortableComponent.writeValue(this.nodeListPerPage);
    }

    private toggleUserSort(): void {
        this.params.sortable = !this.params.sortable;
        if (this.params.sortable) {
            this.sortableNodes = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            this._getListData(this.sortableNodes);
        } else {
            this._getListData(this.nodes);
        }
    }

    private toggleItem(): void {
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
