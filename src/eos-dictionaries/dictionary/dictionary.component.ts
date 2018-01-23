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

import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    WARN_LOGIC_DELETE,
    DANGER_HAVE_NO_ELEMENTS,
    WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE,
    DANGER_LOGICALY_RESTORE_ELEMENT,
    WARN_NO_ORGANIZATION
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
    public selectedNode: EosDictionaryNode;
    public _selectedNodeText: string;
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

    readonly MIN_COL_WIDTH = 90; // 40px - paddings, 50px - content
    readonly DEFAULT_FIELD_LEN = 200;

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
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.treeNode$.takeUntil(this.ngUnsubscribe)
            .subscribe((node: EosDictionaryNode) => {
                if (node) {
                    this._selectedNodeText = node.getTreeView().map((fld) => fld.value).join(' ');
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
        if (window.innerWidth <= 1500) {
            this._sandwichSrv.changeDictState(false, false);
            this._sandwichSrv.changeDictState(false, true);
        }
    }

    goUp() {
        if (this.selectedNode && this.selectedNode.parent) {
            const path = this.selectedNode.parent.getPath();
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
        // console.log('start _countColWidth');
        let _totalWidth = 0;
        const length = {};
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
                length[_f.key] = _f.length / _totalWidth;
            } else {
                length[_f.key] = this.DEFAULT_FIELD_LEN / _totalWidth;
            }
        });

        if (this.customFields) {
            this.customFields.forEach((_f) => {
                if (_f.length) {
                    length[_f.key] = _f.length / _totalWidth;
                } else {
                    length[_f.key] = this.DEFAULT_FIELD_LEN / _totalWidth;
                }
            });
        }
        let fld;
        const folderIcoSize = 42; // Size for block ico folder + rigth padding
        if (this.selectedEl) {
            const _selectedWidth = this.selectedEl.nativeElement.clientWidth;
            fld = folderIcoSize * 100 / _selectedWidth;
            this.tableWidth = _selectedWidth;
            if (this.customFields && this.customFields.length) {
                let w: number;
                this.viewFields.forEach((_f) => {
                    w = this.MIN_COL_WIDTH / (length[_f.key]);
                    if (this.tableWidth < w) {
                        this.tableWidth = w;
                    }
                });

                this.customFields.forEach((_f) => {
                    w = this.MIN_COL_WIDTH / (length[_f.key]);
                    if (this.tableWidth < w) {
                        this.tableWidth = w;
                    }
                });
                if (this.tableWidth <= _selectedWidth) {
                    this.tableWidth = _selectedWidth - 2;
                }
            } else {
                this.tableWidth = _selectedWidth - 2;
            }
        }
        Object.keys(length).forEach((key) => {
            length[key] = Math.floor(length[key] * 100);
        });
        this.length = length;
        this.length['folder'] = fld;
        // console.log('end _countColWidth');
    }

    private _selectNode() {
        if (this.dictionaryId) {
            this._dictSrv.openDictionary(this.dictionaryId)
                .then(() => {
                    // todo: re-factor this ugly solution
                    this._dictSrv.selectNode(this._nodeId);
                })
                .catch((err) => this._errHandler(err));
        }
    }

    /**
     * @description convert selected persons to list of organization representatives,
     * add it to department organization if it exists upwards to tree
     */
    private _createRepresentative() {
        if (this.dictionaryId === 'departments') {
            this._dictSrv.getFullNode(this.dictionaryId, this.selectedNode.id).then((_fullData) => {
                if (_fullData && _fullData.data && _fullData.data.organization['ISN_NODE']) {
                    let _selectedCount = 0;
                    const _represData: any[] = [];
                    if (this.visibleNodes) {
                        this.visibleNodes.forEach((_node) => {
                            if (_node.marked && _node.data.rec['IS_NODE']) {
                                _selectedCount++;
                                _represData.push({
                                    SURNAME: _node.data.rec['SURNAME'],
                                    DUTY: _node.data.rec['DUTY'],
                                    PHONE: _node.data.rec['PHONE'],
                                    PHONE_LOCAL: _node.data.rec['PHONE_LOCAL'],
                                    E_MAIL: _node.data.rec['E_MAIL'],
                                    SEV: _node.data.sev['GLOBAL_ID'], // not sure
                                    ISN_ORGANIZ: _fullData.data.organization['ISN_NODE'],
                                    DEPARTMENT: _fullData.data.rec['CLASSIF_NAME']
                                });
                            }
                        });
                    }
                    if (!_selectedCount) {
                        this._msgSrv.addNewMessage(WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE);
                    } else {
                        /* call API and save */
                        // console.log('Representatives', _represData);
                        return this._dictSrv.createRepresentative(_represData).then((results) => {
                            results.forEach((result) =>
                                this._msgSrv.addNewMessage({
                                    type: result.success ? 'success' : 'warning',
                                    title: result.record['SURNAME'],
                                    msg: result.success ? 'Контакт создан' : result.error.message
                                })
                            );
                        });
                    }
                } else {
                    this._msgSrv.addNewMessage(WARN_NO_ORGANIZATION);
                }
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

        this._dictSrv.openNode(this.visibleNodes[_idx].id);
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
    private _openCreate(params: any) {
        this.modalWindow = this._modalSrv.show(CreateNodeComponent, { class: 'creating-modal modal-lg' });
        this.modalWindow.content.fieldsDescription = this.selectedNode.getEditFieldsDescription();
        this.modalWindow.content.dictionaryId = this.dictionaryId;
        this.modalWindow.content.nodeData = this.selectedNode.getCreatingData(params);

        this.modalWindow.content.onHide.subscribe(() => {
            this.modalWindow.hide();
        });
        this.modalWindow.content.onOpen.subscribe(() => {
            this._openCreate(params);
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
