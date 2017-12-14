import { Component, OnDestroy, ViewChild, TemplateRef, ViewContainerRef, DoCheck, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_NODE_DELETE, CONFIRM_NODES_DELETE, CONFIRM_SUBNODES_RESTORE } from '../../app/consts/confirms.const';
import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { IDictionaryViewParameters } from '../core/eos-dictionary.interfaces';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosSandwichService } from '../services/eos-sandwich.service';

import { E_FIELD_SET, IFieldView } from '../core/dictionary.interfaces';
import { INodeListParams } from '../core/node-list.interfaces';
import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT,
    WARN_LOGIC_DELETE,
    DANGER_HAVE_NO_ELEMENTS,
    DANGER_LOGICALY_RESTORE_ELEMENT
} from '../consts/messages.consts';
import { E_DICT_TYPE } from '../core/dictionary.interfaces';

import { FieldDescriptor } from '../core/field-descriptor'

import { IOrderBy } from '../core/sort.interface'

import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { RECENT_URL } from '../../app/consts/common.consts';
import { NodeListComponent } from '../node-list/node-list.component';
import { ColumnSettingsComponent } from '../column-settings/column-settings.component';
import { IPaginationConfig } from '../node-list-pagination/node-list-pagination.interfaces';
import { LS_PAGE_LENGTH, PAGES } from '../node-list-pagination/node-list-pagination.consts';
// import { setTimeout } from 'timers';

@Component({
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit {
    private ngUnsubscribe: Subject<any> = new Subject();

    @ViewChild(NodeListComponent) nodeListComponent: NodeListComponent;
    @ViewChild('createTpl') createTemplate: TemplateRef<any>;
    @ViewChild('tree') treeEl;

    @ViewChild('selectedWrapper') selectedEl;

    dictionary: EosDictionary;
    dictionaryName: string;
    public dictionaryId: string;

    public params: IDictionaryViewParameters;
    public selectedNode: EosDictionaryNode;
    public _selectedNodeText: string;
    private _nodeId: string;

    treeNodes: EosDictionaryNode[] = [];
    visibleNodes: EosDictionaryNode[] = []; // Elements for one page
    private paginationConfig: IPaginationConfig; // Pagination configuration, use for count node

    public currentState: boolean[]; // State sanwiches
    // readonly states = DICTIONARY_STATES;

    hasParent: boolean;

    anyMarked: boolean;
    anyUnmarked: boolean;
    allMarked: boolean;

    viewFields: IFieldView[] = []; // todo: fill for title

    nodeData: any = {};
    creatingModal: BsModalRef;
    fieldsDescription: any;
    formValidated: boolean;

    customFields: FieldDescriptor[] = [];

    public length = {}; // Length column

    orderBy: IOrderBy;

    treeIsBlocked = false;
    _treeScrollTop = 0;

    dictTypes = E_DICT_TYPE;

    searchStartFlag = false; // flag begin search

    readonly MIN_COL_WIDTH = 90; // 40px - paddings, 50px - content
    readonly DEFAULT_FIELD_LEN = 200;

    tableWidth: number;
    hasCustomTable: boolean;

    public fonConf = {
        width: 0 + 'px',
        height: 0 + 'px',
        top: 0 + 'px'
    }

    get hideTree() {
        return this._sandwichSrv.treeIsBlocked;
    }

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        private _modalSrv: BsModalService,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _deskSrv: EosDeskService,
        private _confirmSrv: ConfirmWindowService,
        private _sandwichSrv: EosSandwichService,
    ) {
        _route.params.subscribe((params) => {
            if (params) {
                this.dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._selectNode();
            }
        });

        _sandwichSrv.currentDictState$.takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean[]) => this.currentState = state);

        _dictSrv.dictionary$.takeUntil(this.ngUnsubscribe)
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    this.dictionary = dictionary;
                    if (this.dictionaryId !== dictionary.id) {
                        this._dictSrv.customFields = [];
                    }
                    this.customFields = this._dictSrv.customFields;
                    this.dictionaryId = dictionary.id;
                    this.params = Object.assign({}, this.params, { userSort: this.dictionary.userOrdered })
                    if (dictionary.root) {
                        this.dictionaryName = dictionary.root.title;
                        this.treeNodes = [dictionary.root];
                    }
                    this.params.markItems = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
                    this.hasCustomTable = this.dictionary.descriptor.canDo(E_ACTION_GROUPS.common,
                        E_RECORD_ACTIONS.tableCustomization);
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.selectedNode$.takeUntil(this.ngUnsubscribe)
            .subscribe((node: EosDictionaryNode) => {
                if (node) {
                    this._selectedNodeText = node.getListView().map((fld) => fld.value).join(' ');
                    this.viewFields = node.getListView();
                    setTimeout(() => {
                        this._countColumnWidth();
                    }, 0);
                    if (!this._dictSrv.userOrdered) {
                        this.orderBy = this._dictSrv.order;
                    }
                    this.hasParent = !!node.parent;
                }
                if (node !== this.selectedNode) {
                    this.selectedNode = node;
                }
            });

        _dictSrv.visibleList$.takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => {
                this.visibleNodes = nodes;
                this.updateMarks();
            });

        _dictSrv.paginationConfig$.takeUntil(this.ngUnsubscribe)
            .subscribe((config: IPaginationConfig) => {
                if (config) {
                    this.paginationConfig = config;
                }
            });

        _dictSrv.viewParameters$.takeUntil(this.ngUnsubscribe)
            .subscribe((viewParameters: IDictionaryViewParameters) => this.params = viewParameters);
    }

    ngOnDestroy() {
        this._sandwichSrv.treeScrollTop = this._treeScrollTop;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    ngAfterViewInit() {
        this._treeScrollTop = this._sandwichSrv.treeScrollTop;
        this.treeEl.nativeElement.scrollTop = this._treeScrollTop;
    }

    ngDoCheck() {
        this._treeScrollTop = this.treeEl.nativeElement.scrollTop;
    }

    transitionEnd(e: Event) {
        this._countColumnWidth();
    }

    private _countColumnWidth() {
        let _totalWidth = 0;
        this.viewFields.forEach((_f) => {
            if (_f.length) {
                _totalWidth += _f.length;
            } else {
                _totalWidth += this.DEFAULT_FIELD_LEN;
            }
        });

        if (this.customFields) {
            this.customFields.forEach((_f) => {
                if (_f.length) {
                    _totalWidth += _f.length;
                } else {
                    _totalWidth += this.DEFAULT_FIELD_LEN;
                }
            });
        }

        /*Use Math.floor() to be be sure that there is enough space */
        this.viewFields.forEach((_f) => {
            if (_f.length) {
                this.length[_f.key] = Math.floor(_f.length / _totalWidth * 100);
            } else {
                this.length[_f.key] = Math.floor(this.DEFAULT_FIELD_LEN / _totalWidth * 100);
            }
        });

        if (this.customFields) {
            this.customFields.forEach((_f) => {
                if (_f.length) {
                    this.length[_f.key] = Math.floor(_f.length / _totalWidth * 100);
                } else {
                    this.length[_f.key] = Math.floor(this.DEFAULT_FIELD_LEN / _totalWidth * 100);
                }
            });
        }

        if (this.selectedEl) {
            const _selectedWidth = this.selectedEl.nativeElement.clientWidth;
            this.tableWidth = _selectedWidth;
            if (this.customFields && this.customFields.length) {
                this.viewFields.forEach((_f) => {
                    if (this.length[_f.key] * 0.01 * this.tableWidth < this.MIN_COL_WIDTH) {
                        this.tableWidth = this.MIN_COL_WIDTH / (this.length[_f.key] * 0.01);
                    }
                });

                this.customFields.forEach((_f) => {
                    if (this.length[_f.key] * 0.01 * this.tableWidth < this.MIN_COL_WIDTH) {
                        this.tableWidth = this.MIN_COL_WIDTH / (this.length[_f.key] * 0.01);
                    }
                });

                if (this.tableWidth <= _selectedWidth) {
                    this.tableWidth = _selectedWidth - 2;
                }
            } else {
                this.tableWidth = _selectedWidth - 2;
            }
        }
    }

    private _selectNode() {
        if (this.dictionaryId) {
            this._dictSrv.openDictionary(this.dictionaryId)
                .then((dictionary) => {
                    // todo: re-factor this ugly solution
                    this._dictSrv.selectNode(this._nodeId);
                })
                .catch((err) => this._errHandler(err));
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
                this._dictSrv.toggleDeleted();
                break;

            case E_RECORD_ACTIONS.userOrder:
                this._dictSrv.toggleUserOrder();
                this.orderBy = this._dictSrv.order;
                break;

            case E_RECORD_ACTIONS.moveUp:
                this._moveUp();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this._moveDown();
                break;

            case E_RECORD_ACTIONS.remove:
                this._deleteItems();
                break;

            case E_RECORD_ACTIONS.removeHard:
                this.physicallyDelete();
                break;

            case E_RECORD_ACTIONS.add:
                this._create();
                break;

            case E_RECORD_ACTIONS.restore:
                this._restoreItems();
                break;
            default:
                console.log('unhandled action', E_RECORD_ACTIONS[action]);
        }
    }

    orderByField(fieldKey: string) {
        this._dictSrv.toggleUserOrder(false);
        if (!this.orderBy || this.orderBy.fieldKey !== fieldKey) {
            this.orderBy = {
                fieldKey: fieldKey,
                ascend: true,
            };
        } else {
            this.orderBy.ascend = !this.orderBy.ascend;
        }
        this._dictSrv.orderBy(this.orderBy);
    }

    userOrdered(nodes: EosDictionaryNode[]) {
        this._dictSrv.setUserOrder(nodes);
    }

    private _moveUp(): void {
        const _idx = this.visibleNodes.findIndex((node) => node.isSelected);

        if (_idx > 0) {
            const item = this.visibleNodes[_idx - 1];
            this.visibleNodes[_idx - 1] = this.visibleNodes[_idx];
            this.visibleNodes[_idx] = item;
            this.nodeListComponent.writeValues(this.visibleNodes);
            this.userOrdered(this.visibleNodes);
        }
    }

    private _moveDown(): void {
        const _idx = this.visibleNodes.findIndex((node) => node.isSelected);
        if (_idx < this.paginationConfig.current * this.paginationConfig.length - 1 && _idx < this.visibleNodes.length - 1) {
            const item = this.visibleNodes[_idx + 1];
            this.visibleNodes[_idx + 1] = this.visibleNodes[_idx];
            this.visibleNodes[_idx] = item;
            this.nodeListComponent.writeValues(this.visibleNodes);
            this.userOrdered(this.visibleNodes);
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
            this._sandwichSrv.changeDictState(false, false);
            this._sandwichSrv.changeDictState(false, true);
        }
    }

    goUp() {
        if (this.selectedNode && this.selectedNode.parent) {
            const path = this._dictSrv.getNodePath(this.selectedNode.parent);
            this._router.navigate(path);
        }
    }

    updateMarks(): void {
        this.anyMarked = this.visibleNodes.findIndex((node) => node.marked) > -1;
        this.anyUnmarked = this.visibleNodes.findIndex((node) => !node.marked) > -1;
        this.allMarked = this.anyMarked;
        this._dictSrv.markItem(this.allMarked);
    }

    /**
     * Toggle checkbox checked all
     */
    public toggleAllMarks(): void {
        this.anyMarked = this.allMarked;
        this.anyUnmarked = !this.allMarked;
        this.visibleNodes.forEach((node) => node.marked = this.allMarked);
        this._dictSrv.markItem(this.allMarked);
    }

    /**
     * Physical delete marked elements on page
     */
    public physicallyDelete(): void {
        let list = '', j = 0;
        this.visibleNodes.forEach((node: EosDictionaryNode) => {
            if (node.marked) {
                j++;
                list += '"' + node.title + '", ';
            }
        })
        list = list.slice(0, list.length - 2);
        if (j === 0) {
            this._msgSrv.addNewMessage(DANGER_HAVE_NO_ELEMENTS)
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

    private _callDelWindow(_confrm: IConfirmWindow): void {
        this._confirmSrv.confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this._dictSrv.deleteMarked()
                        .then((success) => {
                            if (!success) {
                                this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                            }
                        })
                        .catch((err) => this._errHandler(err));
                }
            });
    }

    validate(valid: boolean) {
        this.formValidated = valid;
    }

    private _clearForm() {
        this.formValidated = false;
        this.nodeData = this.selectedNode.getCreatingData();
    }

    private _create() {
        this._clearForm();
        this.fieldsDescription = this.selectedNode.getEditFieldsDescription();
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
            this._dictSrv.customFields = this.customFields;
            this._countColumnWidth();
            this.creatingModal.hide();
        })
    }

    public create(hide = true) {
        this._dictSrv.addNode(this.nodeData)
            .then((node) => {
                // console.log('created node', node);
                let title = '';
                node.getShortQuickView().forEach((_f) => {
                    title += this.nodeData.rec[_f.key];
                });
                this._deskSrv.addRecentItem({
                    url: this._breadcrumbsSrv.currentLink.url + '/' + node.id + '/edit',
                    title: title,
                    fullTitle: this._breadcrumbsSrv.currentLink.fullTitle + '/' + node.data.rec.CLASSIF_NAME
                });
                // if (hide) {
                this.creatingModal.hide();
                // }
                // this._clearForm();
                if (!hide) {
                    this._create();
                }
            })
            .catch((err) => this._errHandler(err));
    }

    cancelCreate() {
        this.creatingModal.hide();
        this._clearForm();
    }

    /**
     * Logic delete marked elements on page
     */
    private _deleteItems(): void {
        let delCount = 0, allCount = 0;
        this.visibleNodes.forEach((node: EosDictionaryNode) => {
            if (node.marked) { allCount++ }
            if (node.marked && node.isDeleted) { delCount++ }
        })
        if (delCount === allCount) {
            this._msgSrv.addNewMessage(WARN_LOGIC_DELETE);
        }
        this._dictSrv.markDeleted(true, true) // todo: add recursive dialogue if any children
            .then(() => this.updateMarks())
            .catch((err) => this._errHandler(err));
    }

    private _restoreItems(): void {
        const marked = this.visibleNodes.filter((node) => node.marked);
        const withChildren: string[] = [];

        marked.forEach((node) => {
            if (node.parent && node.parent.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
                node.marked = false;
            } else {
                if (node.children && node.children.length) {
                    withChildren.push(node.title);
                }
            }
        });

        if (withChildren.length) {
            const _confrm = Object.assign({}, CONFIRM_SUBNODES_RESTORE);
            _confrm.body = _confrm.body.replace('{{name}}', withChildren.join(', '));

            this._confirmSrv
                .confirm(_confrm)
                .then((confirmed: boolean) => {
                    if (confirmed) {
                        this._dictSrv.markDeleted(confirmed, false);
                    }
                });
        } else {
            this._dictSrv.markDeleted(false, false);
        }

        this.anyMarked = false;
        this.allMarked = false;
    }

    public resize(): void {
        this._sandwichSrv.resize();
        setTimeout(() => {
            this._countColumnWidth();
        }, 0);
    }

    private _errHandler(err) {
        console.error(err);
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage,
            dismissOnTimeout: 100000
        });
    }
}
