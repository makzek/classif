import { Component, OnDestroy, ViewChild, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_NODE_DELETE, CONFIRM_NODES_DELETE } from '../../app/consts/confirms.const';
import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';

import { E_FIELD_SET, IFieldView } from '../core/dictionary.interfaces';
import { INodeListParams } from '../core/node-list.interfaces';
import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

import { FieldDescriptor } from '../core/field-descriptor'

import {
    DictionaryActionService,
    DICTIONARY_ACTIONS,
    DICTIONARY_STATES
} from '../dictionary/dictionary-action.service';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { RECENT_URL } from '../../app/consts/common.consts';
import { IListPage } from '../node-list-pagination/node-list-pagination.component';
import { NodeListComponent } from '../node-list/node-list.component';
import { ColumnSettingsComponent } from '../column-settings/column-settings.component';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, OnInit {
    @ViewChild(NodeListComponent) nodeListComponent: NodeListComponent;
    @ViewChild('createTpl') createTemplate: TemplateRef<any>;

    dictionary: EosDictionary;
    dictionaryName: string;
    public dictionaryId: string;

    public params: INodeListParams;
    public _selectedNode: EosDictionaryNode;
    public _selectedNodeText: string;
    private _nodeId: string;

    treeNodes: EosDictionaryNode[];
    listNodes: EosDictionaryNode[];
    visibleNodes: EosDictionaryNode[]; // Checkbox use it property

    private _page: IListPage;

    currentState: number;
    readonly states = DICTIONARY_STATES;

    private _subscriptions: Subscription[];

    anyMarked: boolean;
    anyUnmarked: boolean;
    allMarked: boolean;

    viewFields: IFieldView[] = []; // todo: fill for title

    nodeData: any = {};
    creatingModal: BsModalRef;
    fieldsDescription: any;
    formValidated: boolean;

    customFields: FieldDescriptor[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        private _orderSrv: EosDictOrderService,
        private _modalSrv: BsModalService,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _deskSrv: EosDeskService,
        /* remove unused */
        private _dictActSrv: DictionaryActionService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        console.log('')
        this.params = {
            userSort: false,
            showDeleted: false,
            hasParent: false
        };

        this._subscriptions = [];
        this.treeNodes = [];
        this.listNodes = [];
        this.visibleNodes = [];
        this.currentState = this._dictActSrv.state;

        this._subscriptions.push(this._route.params.subscribe((params) => {
            if (params) {
                this.dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._update();
            }
        }));

        this._subscriptions.push(_dictSrv.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this.dictionary = dictionary;
                this.dictionaryId = dictionary.id;
                if (dictionary.root) {
                    this.dictionaryName = dictionary.root.title;
                }
                this.treeNodes = [dictionary.root];
                this.params.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
            } else {
                this.treeNodes = [];
            }
        }));

        this._subscriptions.push(_dictActSrv.action$.subscribe((action) => {
            this._dictActSrv.closeAll = false;
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
                this._selectedNodeText = node.getListView().map((fld) => fld.value).join(' ');
                this.viewFields = node.getListView();
                this.params.hasParent = !!node.parent;
                this.listNodes = node.children || [];
                this.listNodes.sort(this._orderSrv.defaultSort);
                if (this.listNodes[0]) {
                    this._updateVisibleNodes();
                }
            } else {
                this.listNodes = [];
            }
        }));
    }

    ngOnDestroy() {
        this._subscriptions.forEach((_s) => _s.unsubscribe());
    }


    private _update() {
        if (this.dictionaryId) {
            this._dictSrv.openDictionary(this.dictionaryId)
                .then(() => this._dictSrv.selectNode(this._nodeId));
        }
    }

    private _updateVisibleNodes() {
        let _list: EosDictionaryNode[];
        const page = this._page;
        if (this.params && this.params.userSort) {
            console.log('sorting', this.params);
            _list = this._orderSrv.getUserOrder(this.listNodes, this.listNodes[0].parentId); // !!! Parent id err
        } else {
            _list = this.listNodes;
        }

        if (!this.params.showDeleted) {
            _list = _list.filter((node) => node.isVisible(this.params.showDeleted));
        }

        if (page) {
            this.visibleNodes = _list.slice((page.start - 1) * page.length, page.current * page.length);
        } else {
            this.visibleNodes = _list;
        }
    }

    pageChanged(page: IListPage) {
        this._page = page;
        if (this.listNodes[0]) {
            this._updateVisibleNodes();
        }
    }

    doAction(action: E_RECORD_ACTIONS) {
        switch (action) {
            case E_RECORD_ACTIONS.navigateDown:
                this._openNodeNavigate(false);
                break;

            case E_RECORD_ACTIONS.navigateUp:
                this._openNodeNavigate(true);
                break;

            case E_RECORD_ACTIONS.edit:
                this._editNode();
                break;

            case E_RECORD_ACTIONS.showDeleted:
                this._toggleDeleted();
                break;

            case E_RECORD_ACTIONS.userOrder:
                this._toggleUserSort();
                break;

            case E_RECORD_ACTIONS.moveUp:
                this._moveUp();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this._moveDown();
                break;

            case E_RECORD_ACTIONS.remove:
                this.deleteSelectedItems();
                break;

            case E_RECORD_ACTIONS.removeHard:
                this.physicallyDelete();
                break;

            case E_RECORD_ACTIONS.add:
                this._create();
                break;
            /*
            // case E_RECORD_ACTIONS.restore: {
            */
            default:
                console.log('alarmaaaa!!! unhandled', E_RECORD_ACTIONS[action]);
        }
    }
    private _moveUp(): void {
        const _idx = this.visibleNodes.findIndex((node) => node.isSelected);

        if (_idx > 0) {
            const item = this.visibleNodes[_idx - 1];
            this.visibleNodes[_idx - 1] = this.visibleNodes[_idx];
            this.visibleNodes[_idx] = item;
            this.nodeListComponent.writeValues(this.visibleNodes);
        }
    }

    private _moveDown(): void {
        const _idx = this.visibleNodes.findIndex((node) => node.isSelected);
        if (_idx > 0) {
            const item = this.visibleNodes[_idx + 1];
            this.visibleNodes[_idx + 1] = this.visibleNodes[_idx];
            this.visibleNodes[_idx] = item;
            this.nodeListComponent.writeValues(this.visibleNodes);
        }
    }

    private _editNode() {
        const node = this.visibleNodes.find((n) => n.isSelected || n.isActive);
        if (node) {
            if (node.data.PROTECTED) {
                this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else if (node.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
            } else /*(!node.data.PROTECTED && !node.isDeleted) */ {
                const url = this._router.url;
                this._storageSrv.setItem(RECENT_URL, url);
                const _path = this._dictSrv.getNodePath(node);
                _path.push('edit');
                this._router.navigate(_path);
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }
    }

    private _openNodeNavigate(backward = false): void {
        let _idx = this.visibleNodes.findIndex((node) => node.isSelected);
        /*
        if (_idx < 0) {
            _idx = 0;
        }
        */

        if (backward) {
            if (_idx > -1) {
                _idx--;
            }
        } else {
            _idx++;
        }
        _idx = (_idx + this.visibleNodes.length) % this.visibleNodes.length;

        this._dictSrv.openNode(this.visibleNodes[_idx].id);
    }

    onClick() {
        if (window.innerWidth <= 1500) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
            this._dictActSrv.closeAll = true;
        }
    }

    goUp() {
        if (this._selectedNode && this._selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this._selectedNode.parent);
            this._router.navigate(path);
        }
    }

    private _toggleDeleted() {
        this.params = Object.assign({}, this.params, { showDeleted: !this.params.showDeleted });
        if (!this.params.showDeleted) {
            // Fall checkbox with deleted elements
            for (const node of this.listNodes) {
                if (node.data.DELETED === 1) {
                    node.marked = false;
                }
            }
            this.updateMarks();
        }
        this._updateVisibleNodes();
    }

    private _toggleUserSort(): void {
        this.params = Object.assign({}, this.params, { userSort: !this.params.userSort });
        if (this._selectedNode) {
            this._updateVisibleNodes();
        }
    }

    updateMarks() {
        this.anyMarked = this.listNodes.findIndex((node) => node.marked) > -1;
        this.anyUnmarked = this.listNodes.findIndex((node) => !node.marked) > -1;
        this.allMarked = this.anyMarked;
    }

    toggleAllMarks() {
        this.anyMarked = this.allMarked;
        this.anyUnmarked = !this.allMarked;
        this.listNodes.forEach((node) => node.marked = this.allMarked);
    }

    private _updateChildrenMarks(marked: boolean) {
        this.listNodes.forEach((node) => node.marked = marked);
    }
    /* darkside */

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
        this._dictSrv.deleteSelectedNodes(this.dictionaryId, selectedNodes);
    }

    physicallyDelete(): void {
        if (this.listNodes) {
            let list = '', j = 0;
            for (const node of this.listNodes) {
                if (node.marked) {
                    j++;
                    list += '"' + node.data.CLASSIF_NAME + '", ';
                }
            }
            list = list.slice(0, list.length - 2);
            if (j === 0) {
                return;
            } else if (j === 1) {
                const _confrm = Object.assign({}, CONFIRM_NODE_DELETE);
                _confrm.body = _confrm.body.replace('{{name}}', list);
                this._callDelWindow(_confrm);
            } else {
                const _confrm = Object.assign({}, CONFIRM_NODES_DELETE);
                _confrm.body = _confrm.body.replace('{{name}}', list);
                this._callDelWindow(_confrm);
            }
        }
    }

    private _callDelWindow(_confrm: IConfirmWindow): void {
        this._confirmSrv.confirm(_confrm).then((confirmed: boolean) => {
            if (confirmed) {
                for (const node of this.listNodes) {
                    if (node.marked) {
                        if (1 !== 1) { // here must be API request for check if possible to delete
                            this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                        } else {
                            const _deleteResult = this._dictSrv.physicallyDelete(node.id);
                            if (_deleteResult) {
                                this._router.navigate(this._dictSrv.getNodePath(node.parent));
                            } else {
                                this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                            }
                        }
                    }
                }
            }
        }).catch();
    }

    validate(valid: boolean) {
        this.formValidated = valid;
    }

    private _clearForm() {
        this.formValidated = false;
        this.nodeData = {};
    }

    private _create() {
        this._clearForm();
        this.fieldsDescription = this._selectedNode.getEditFieldsDescription();
        this.creatingModal = this._modalSrv.show(this.createTemplate, { class: 'creating-modal modal-lg' });
    }

    public _configColumns() {
        const _fldsCurr = [];
        const _allFields = [];
        this.creatingModal = this._modalSrv.show(ColumnSettingsComponent, { class: 'column-settings-modal modal-lg' });
        Object.assign(this.creatingModal.content.currentFields, this.customFields);
        this.creatingModal.content.dictionaryFields = this.dictionary.descriptor.getFieldSet(E_FIELD_SET.allVisible);
        this.creatingModal.content.onChoose.subscribe((_fields) => {
            this.customFields = _fields;
            console.log(this.customFields);
            this.creatingModal.hide();
        })
    }

    create(hide = true) {
        this._dictSrv.addNode(this.nodeData)
            .then((node) => {
                console.log('created node', node);
                let title = '';
                node.getShortQuickView().forEach((_f) => {
                    title += this.nodeData[_f.key];
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
                this._clearForm();
            });
    }

    cancelCreate() {
        this.creatingModal.hide();
        this._clearForm();
    }

    ngOnInit() {
        this.params.userSort = this._orderSrv.getSortingMode();
        if (window.innerWidth > 1500) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openInfo);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openTree);
        }
    }

    public resize(): void {
        if (window.innerWidth > 1500) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openInfo);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openTree);
        } else {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
        }
    }
}
