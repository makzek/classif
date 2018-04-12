import { Component, OnDestroy, ViewChild, DoCheck, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_NODE_DELETE, CONFIRM_NODES_DELETE, CONFIRM_SUBNODES_RESTORE } from 'app/consts/confirms.const';
import { IConfirmWindow } from 'eos-common/core/confirm-window.interface';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import {
    IDictionaryViewParameters, E_FIELD_SET, IFieldView,
    E_DICT_TYPE, IOrderBy, E_RECORD_ACTIONS, IActionEvent
} from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { EosSandwichService } from '../services/eos-sandwich.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';

import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    WARN_LOGIC_DELETE,
    DANGER_HAVE_NO_ELEMENTS,
    DANGER_LOGICALY_RESTORE_ELEMENT,
    WARN_ELEMENT_PROTECTED
} from '../consts/messages.consts';

import { RECENT_URL } from 'app/consts/common.consts';
import { NodeListComponent } from '../node-list/node-list.component';
import { ColumnSettingsComponent } from '../column-settings/column-settings.component';
import { CreateNodeComponent } from '../create-node/create-node.component';
import { IPaginationConfig } from '../node-list-pagination/node-list-pagination.interfaces';

@Component({
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit {
    @ViewChild(NodeListComponent) nodeListComponent: NodeListComponent;
    @ViewChild('tree') treeEl;

    @ViewChild('selectedWrapper') selectedEl;

    dictionary: EosDictionary;
    listDictionary: EosDictionary;

    dictionaryName: string;
    public dictionaryId: string;

    public params: IDictionaryViewParameters;
    public treeNode: EosDictionaryNode;
    public title: string;
    treeNodes: EosDictionaryNode[] = [];
    visibleNodes: EosDictionaryNode[] = []; // Elements for one page
    paginationConfig: IPaginationConfig; // Pagination configuration, use for count node

    public currentState: boolean[]; // State sanwiches
    // readonly states = DICTIONARY_STATES;

    hasParent: boolean;

    anyMarked: boolean;
    anyUnmarked: boolean;
    allMarked: boolean;

    viewFields: IFieldView[] = []; // todo: fill for title
    customFields: IFieldView[] = [];

    modalWindow: BsModalRef;
    formValidated = false;
    hasChanges = false;

    public length = {}; // Length column

    orderBy: IOrderBy;

    treeIsBlocked = false;
    _treeScrollTop = 0;

    dictTypes = E_DICT_TYPE;

    dictMode = 1;

    searchStartFlag = false; // flag begin search
    fastSearch = false;

    tableWidth: number;
    hasCustomTable: boolean;

    public fonConf = {
        width: 0 + 'px',
        height: 0 + 'px',
        top: 0 + 'px'
    };

    get hideTree() {
        return this._sandwichSrv.treeIsBlocked;
    }

    private _nodeId: string;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _route: ActivatedRoute,
        private _router: Router,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _modalSrv: BsModalService,
        private _confirmSrv: ConfirmWindowService,
        private _sandwichSrv: EosSandwichService,
        private _bcSrv: EosBreadcrumbsService,
    ) {
        _route.params.subscribe((params) => {
            if (params) {
                this.dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                if (this.dictionaryId) {
                    this._dictSrv.openDictionary(this.dictionaryId)
                        .then(() => this._dictSrv.selectTreeNode(this._nodeId))
                        .catch((err) => this._errHandler(err));
                }
            }
        });

        _sandwichSrv.currentDictState$.takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean[]) => this.currentState = state);

        _dictSrv.dictionary$.takeUntil(this.ngUnsubscribe)
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    this.dictionary = dictionary;
                    this.dictionaryId = dictionary.id;
                    if (dictionary.root) {
                        this.dictionaryName = dictionary.root.title;
                        this.treeNodes = [dictionary.root];
                    }
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.listDictionary$.takeUntil(this.ngUnsubscribe)
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    this.dictMode = this._dictSrv.dictMode;
                    this.customFields = this._dictSrv.customFields;
                    this.viewFields = dictionary.getListView();
                    const _customTitles = this._dictSrv.customTitles;
                    _customTitles.forEach((_title) => {
                        const vField = this.viewFields.find((_field) => _field.key === _title.key);
                        if (vField) {
                            vField.customTitle = _title.customTitle;
                        }
                    });
                    this.params = Object.assign({}, this.params, { userSort: dictionary.userOrdered });
                    this.params.markItems = dictionary.canDo(E_RECORD_ACTIONS.markRecords);
                    this.hasCustomTable = dictionary.canDo(E_RECORD_ACTIONS.tableCustomization);
                    if (dictionary.root) {
                        this.dictionaryName = dictionary.root.title;
                        this.treeNodes = [dictionary.root];
                    }
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.treeNode$.takeUntil(this.ngUnsubscribe)
            .subscribe((node: EosDictionaryNode) => {
                if (node) {
                    this.title = node.getTreeView().map((fld) => fld.value).join(' ');
                    if (!this._dictSrv.userOrdered) {
                        this.orderBy = this._dictSrv.order;
                    }
                    this.hasParent = !!node.parent;
                    const url = this._router.url;
                    this._storageSrv.setItem(RECENT_URL, url);
                }
                if (node !== this.treeNode) {
                    this.treeNode = node;
                }
            });

        _dictSrv.visibleList$.takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => {
                // console.log('visibleList', nodes);
                this.visibleNodes = nodes;
                setTimeout(() => {
                    this._countColumnWidth();
                }, 0);
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

        this._bcSrv._eventFromBc$.takeUntil(this.ngUnsubscribe)
            .subscribe((action: IActionEvent) => {
                if (action) {
                    this.doAction(action);
                }
            });
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

    transitionEnd() {
        this._countColumnWidth();
    }

    doAction(evt: IActionEvent) {
        switch (evt.action) {
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
                this._openCreate(evt.params);
                break;

            case E_RECORD_ACTIONS.restore:
                this._restoreItems();
                break;
            case E_RECORD_ACTIONS.showAllSubnodes:
                this._dictSrv.toggleAllSubnodes();
                break;

            case E_RECORD_ACTIONS.createRepresentative:
                this._createRepresentative();
                break;
            case E_RECORD_ACTIONS.tableCustomization:
                this._configColumns();
                break;
            default:
                console.warn('unhandled action', E_RECORD_ACTIONS[evt.action]);
        }
    }

    resetSearch() {
        this._dictSrv.resetSearch();
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

    onClick() {
        if (window.innerWidth < 1600) {
            this._sandwichSrv.changeDictState(false, true);
        }
    }

    goUp() {
        if (this.treeNode && this.treeNode.parent) {
            const path = this.treeNode.parent.getPath();
            this._router.navigate(path);
        }
    }

    updateMarks(): void {
        this.anyMarked = this.visibleNodes.findIndex((node) => node.marked) > -1;
        this.anyUnmarked = this.visibleNodes.findIndex((node) => !node.marked) > -1;
        this.allMarked = this.anyMarked;
        this._dictSrv.markItem(this.allMarked);
    }

    switchFastSearch(val: boolean) {
        this.fastSearch = val;
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
        });

        list = list.slice(0, list.length - 2);
        if (j === 0) {
            this._msgSrv.addNewMessage(DANGER_HAVE_NO_ELEMENTS);
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

    /**
     * @description Open modal with ColumnSettingsComponent, fullfill ColumnSettingsComponent data
     */
    public _configColumns() {
        // const _fldsCurr = [];
        // const _allFields = [];
        this.modalWindow = this._modalSrv.show(ColumnSettingsComponent, { class: 'column-settings-modal modal-lg' });
        this.modalWindow.content.fixedFields = this.viewFields;
        Object.assign(this.modalWindow.content.currentFields, this.customFields);
        Object.assign(this.modalWindow.content.dictionaryFields, this.dictionary.descriptor.record.getFieldSet(E_FIELD_SET.allVisible));
        this.modalWindow.content.onChoose.subscribe((_fields) => {
            this.customFields = _fields;
            this._dictSrv.customFields = this.customFields;
            this._dictSrv.customTitles = this.viewFields;
            /* tslint:enable:no-bitwise */
            this._countColumnWidth();
            this.modalWindow.hide();
        });
    }

    public resize(): void {
        this._sandwichSrv.resize();
    }

    setDictMode(mode: number) {
        this._dictSrv.setDictMode(mode);
    }

    private _countColumnWidth() {
        const span = document.createElement('span'),
            body = document.getElementsByTagName('body'),
            PADDING_SPACE = 74; // padding 20 * 2 + 24 sort ico

        span.style.position = 'absolute';
        span.style.top = '-5000px';
        span.style.left = '-5000px';
        span.style.fontSize = '16px';
        body[0].appendChild(span);
        const length = {};
        let fullWidth = 0;
        this.viewFields.forEach((_f) => {
            if (_f.customTitle) {
                span.innerText = _f.customTitle;
            } else {
                span.innerText = _f.title;
            }
            length[_f.key] = PADDING_SPACE + span.clientWidth;
            fullWidth += PADDING_SPACE + span.clientWidth;
        });

        if (this.customFields) {
            this.customFields.forEach((_f) => {
                if (_f.customTitle) {
                    span.innerText = _f.customTitle;
                } else {
                    span.innerText = _f.title;
                }
                length[_f.key] = PADDING_SPACE + span.clientWidth;
                fullWidth += PADDING_SPACE + span.clientWidth;
            });
        }
        this.length = length;
        body[0].removeChild(span);
    }

    /**
     * @description convert selected persons to list of organization representatives,
     * add it to department organization if it exists upwards to tree
     */
    private _createRepresentative() {
        if (this.dictionaryId === 'departments') {
            this._dictSrv.createRepresentative()
                .then((results) => {
                    results.forEach((result) => {
                        this._msgSrv.addNewMessage({
                            type: result.success ? 'success' : 'warning',
                            title: result.record['SURNAME'],
                            msg: result.success ? 'Контакт создан' : result.error.message
                        });
                    });
                });
        }
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
                const _path = node.getPath();
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

        const node = this.visibleNodes[_idx];
        if (node && node.id) {
            this._dictSrv.openNode(node.id);
        }
    }

    private _callDelWindow(_confrm: IConfirmWindow): void {
        this._confirmSrv.confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    return this._dictSrv.deleteMarked();
                }
            })
            .catch((err) => this._errHandler(err));
    }

    /**
     * @description Open modal with CreateNodeComponent, fullfill CreateNodeComponent data
     */
    private _openCreate(recParams: any) {
        this.modalWindow = this._modalSrv.show(CreateNodeComponent, { class: 'creating-modal' });
        const dictionary = this._dictSrv.currentDictionary;
        const editDescr = dictionary.getEditDescriptor();
        const data = dictionary.getNewNode({ rec: recParams }, this.treeNode);

        this.modalWindow.content.fieldsDescription = editDescr;
        this.modalWindow.content.dictionaryId = dictionary.id;
        this.modalWindow.content.nodeData = data;

        this.modalWindow.content.onHide.subscribe(() => {
            this.modalWindow.hide();
        });
        this.modalWindow.content.onOpen.subscribe(() => {
            this._openCreate(recParams);
        });
    }

    /**
     * Logic delete marked elements on page
     */
    private _deleteItems(): void {
        let delCount = 0, allCount = 0;
        this.visibleNodes.forEach((node: EosDictionaryNode) => {
            if (node.marked) { allCount++; }
            if (node.marked && node.isDeleted) { delCount++; }
            if (node.marked && node.isProtected) {
                node.marked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
            }
        });
        if (delCount === allCount) {
            this._msgSrv.addNewMessage(WARN_LOGIC_DELETE);
        }
        this._dictSrv.markDeleted(true, true) // todo: add recursive dialogue if any children
            .then(() => this.updateMarks())
            .catch((err) => this._errHandler(err));
    }

    private _restoreItems(): void {
        const marked = this.visibleNodes.filter((node) => node.marked);
        const childrenTitles: string[] = [];
        let p: Promise<any>;

        marked.forEach((node) => {
            if (node.parent && node.parent.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
                node.marked = false;
            } else {
                if (node.children && node.children.length) {
                    childrenTitles.push(node.title);
                }
            }
        });

        if (childrenTitles.length) {
            const _confrm = Object.assign({}, CONFIRM_SUBNODES_RESTORE);
            _confrm.body = _confrm.body.replace('{{name}}', childrenTitles.join(', '));

            p = this._confirmSrv
                .confirm(_confrm)
                .then((confirmed: boolean) => this._dictSrv.markDeleted(confirmed, false));
        } else {
            p = this._dictSrv.markDeleted(false, false);
        }
        p.then(() => {
            this.anyMarked = false;
            this.allMarked = false;
        });
    }

    private _errHandler(err) {
        console.warn(err);
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage
        });
    }
}
