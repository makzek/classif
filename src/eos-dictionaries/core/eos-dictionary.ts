import {
    E_DICT_TYPE,
    E_FIELD_SET,
    IDictionaryDescriptor,
    IDepartmentDictionaryDescriptor,
    ITreeDictionaryDescriptor,
    E_FIELD_TYPE,
    ISearchSettings,
    SEARCH_MODES,
    IOrderBy,
    IRecordOperationResult,
    E_RECORD_ACTIONS,
} from 'eos-dictionaries/interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { TreeDictionaryDescriptor } from './tree-dictionary-descriptor';
import { DepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';

import { PipRX } from 'eos-rest/services/pipRX.service';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';
import { Injector } from '@angular/core/src/di/injector';

export class EosDictionary {
    descriptor: AbstractDictionaryDescriptor;
    root: EosDictionaryNode;
    private _nodes: Map<string, EosDictionaryNode>;

    private _orderBy: IOrderBy;
    private _userOrder: any;
    private _userOrdered: boolean;
    private _orderedArray: { [parentId: string]: EosDictionaryNode[] };
    private _showDeleted: boolean;
    private _mode: number;
    private _dictionaries: { [key: string]: EosDictionary };

    get showDeleted(): boolean {
        return this._showDeleted;
    }

    set showDeleted(value: boolean) {
        this._showDeleted = value;
        this._nodes.forEach((node) => node.updateExpandable(value));
    }

    get id(): string {
        return this.descriptor.id;
    }

    get title(): string {
        return this.descriptor.title;
    }

    get nodes(): Map<string, EosDictionaryNode> {
        return this._nodes;
    }

    get userOrdered(): boolean {
        return this._userOrdered;
    }

    set userOrdered(userOrdered: boolean) {
        this._userOrdered = userOrdered;
    }

    set orderBy(order: IOrderBy) {
        this._orderBy = order;
    }

    public defaultOrder() {
        this._orderBy = {
            ascend: true,
            fieldKey: 'CLASSIF_NAME'
        };
    }

    get orderBy() {
        return this._orderBy;
    }

    get canMarkItems(): boolean {
        return this.descriptor.record.canDo(E_RECORD_ACTIONS.markRecords)
    }

    constructor(dictId: string, private dictDescrSrv: DictionaryDescriptorService) {
        this.descriptor = dictDescrSrv.getDescriptorClass(dictId);
        this._nodes = new Map<string, EosDictionaryNode>();
        this._dictionaries = {};
        this.defaultOrder();
    }

    canDo(action: E_RECORD_ACTIONS): boolean {
        return this.descriptor.record.canDo(action);
    }

    init(): Promise<EosDictionaryNode> {
        this._nodes.clear();
        return this.descriptor.getRoot()
            .then((data: any[]) => {
                this.updateNodes(data, true);
                return this.root;
            })
    }

    initUserOrder(userOrdered: boolean, userOrder: any) {
        this._userOrdered = userOrdered;
        this._userOrder = userOrder;
    }

    private _updateTree(nodes: EosDictionaryNode[]) {
        /* build tree */
        nodes.forEach((_node) => {
            if (_node.parentId) {
                const parent = this._nodes.get(_node.parentId);
                if (parent) {
                    parent.addChild(_node);
                }
            }
        });

        /* find root */
        if (!this.root) {
            let rootNode: EosDictionaryNode;
            if (this.descriptor.dictionaryType !== E_DICT_TYPE.linear) {
                rootNode = nodes.find((node) => node.parentId === null || node.parentId === undefined);
            }

            /* fallback if root undefined */
            if (!rootNode) {
                rootNode = new EosDictionaryNode(this, { IS_NODE: 0, POTECTED: 1 });
                rootNode.children = [];
                this._nodes.set(rootNode.id, rootNode);
            }

            this.root = rootNode;
        }

        /* force set title and visible for root */
        this.root.title = this.descriptor.title;
        this.root.data.rec['DELETED'] = false;
        this.root.isExpanded = true;

        nodes.forEach((node) => {
            if (!node.parent && node !== this.root) {
                this.root.addChild(node);
            }
            node.updateExpandable(this._showDeleted);
        });
        this.root.updateExpandable(this._showDeleted);
    }

    expandNode(nodeId: string): Promise<EosDictionaryNode> {
        const node = this._nodes.get(nodeId);
        if (node) {
            return this.descriptor.getSubtree(node.data.rec)
                .then((nodes) => {
                    this.updateNodes(nodes, true);
                    return node;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    updateNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        const nodeIds: string[] = [];
        data.forEach((nodeData) => {
            if (nodeData) {
                const nodeId = nodeData[this.descriptor.record.keyField.foreignKey] + '';
                let _node = this._nodes.get(nodeId);
                if (_node) {
                    _node.updateData(nodeData);
                } else {
                    _node = new EosDictionaryNode(this, nodeData);
                    if (_node) {
                        this._nodes.set(_node.id, _node);
                    }
                }
                if (_node && nodeIds.findIndex((id) => id === _node.id) === -1) {
                    nodeIds.push(_node.id);
                }

            } else {
                console.log('no data');
            }
        });

        const nodes = nodeIds.map((id) => this._nodes.get(id))
            .filter((node) => !!node);

        if (updateTree) {
            this._updateTree(nodes);
        }

        return nodes;
    }

    getFullNodeInfo(nodeId: string): Promise<EosDictionaryNode> {
        // console.log('getFullNodeInfo fired', nodeId);
        return this.getNodeByNodeId(nodeId)
            .then((node) => {
                if (node) {
                    switch (this.descriptor.type) {
                        case E_DICT_TYPE.department:
                            let orgDUE = '';
                            orgDUE = node.data.rec['DUE_LINK_ORGANIZ'];
                            if (!orgDUE) {
                                const parentNode = node.getParents().find((parent) => parent.data.rec['DUE_LINK_ORGANIZ']);
                                if (parentNode) {
                                    orgDUE = parentNode.data.rec['DUE_LINK_ORGANIZ'];
                                }
                            }
                            return Promise.all([
                                this.descriptor.getRelated(node.data.rec, orgDUE),
                                this.descriptor.getRelatedSev(node.data.rec)
                            ]).then(([related, sev]) => {
                                node.data = Object.assign(node.data, related, { sev: sev });
                                console.log('full node info', node.data);
                                return node;
                            });
                        case E_DICT_TYPE.tree:
                            return this.descriptor.getRelatedSev(node.data.rec)
                                .then((sev) => {
                                    node.data = Object.assign(node.data, { sev: sev });
                                    return node;
                                });
                        default:
                            return node;
                    }
                } else {
                    return node;
                }
            });
    }

    getNodeByNodeId(nodeId: string): Promise<EosDictionaryNode> {
        let id: any = nodeId;

        if (this.descriptor.record.keyField.type === E_FIELD_TYPE.number) {
            id = id * 1;
        }

        return this.descriptor.getRecord(id)
            .then((records) => {
                this.updateNodes(records, true);
                return this._nodes.get(nodeId);
            });
    }

    getNode(nodeId: string): /*Promise<*/EosDictionaryNode/*>*/ {
        const node = this._nodes.get(nodeId);
        /*
            if (this.descriptor.type !== E_DICT_TYPE.linear) {
                this.descriptor.getChildren(node.data.rec)
                    .then((nodes) => {
                        this.updateNodes(nodes, true);
                })
            }
        */
        // console.log('get node', this.id, nodeId, this._nodes, _res);
        return node;
    }

    addNode(node: EosDictionaryNode, parentId?: string): boolean {
        // console.log('createNewNode does nothing yet because newNode.id === undefined ');
        let _result = false;

        // check that node with specified id does not exist in this instance
        if (!this._nodes.has(node.id)) {
            this._nodes.set(node.id, node);
            if (!parentId) {
                const _parent: EosDictionaryNode = this._nodes.get(parentId); // ??

                if (_parent) {
                    _parent.addChild(node);
                    _result = true;
                }
            } else {
                if (node.parent) {
                    node.parent.addChild(node);
                } else {
                    this._nodes.get(parentId).addChild(node);
                }
            }
        }
        return _result;
    }

    /**
     * @description Set DELETED flag for marked records
     * @param recursive do cascade operation, default false
     * @param deleted mark as deleted (true), unmarkmark as deleted (false)
     */
    markDeleted(recursive = false, deleted = true): Promise<any> {
        const nodeSet = this._getMarkedRecords(false);
        this._resetMarked();
        // 1 - mark deleted
        // 0 - unmark deleted
        return this.descriptor.markDeleted(nodeSet, ((deleted) ? 1 : 0), recursive);
    }

    getAllChildren(node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        const layer = node.originalId.toString().split('.').length - 1;
        const critery = {
            [node._descriptor.keyField.foreignKey]: node.originalId + '%',
            ['LAYER']: layer + ':Null'
        };
        return this.search([critery]);
    }

    getChildren(node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        if (node) {
            node.updating = true;
            return this.descriptor.getChildren(node.data.rec)
                .then((nodes) => {
                    const res = this.updateNodes(nodes, true);
                    node.updating = false;
                    return res;
                })
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * @description Delete marked records from DB
     */
    deleteMarked(): Promise<IRecordOperationResult[]> {
        const records = this._getMarkedRecords();
        this._nodes.forEach((node) => {
            if (node.marked) {
                node.delete();
                this._nodes.delete(node.id);
            }
        });
        this._resetMarked();
        // this.descriptor.record.keyField.foreignKey
        return this.descriptor.deleteRecords(records);
    }

    getDictionaryIdByMode(mode: number): EosDictionary {
        const dictId = this.descriptor.getIdByDictionaryMode(mode);
        if (!this._dictionaries[dictId]) {
            this._dictionaries[dictId] = new EosDictionary(dictId, this.dictDescrSrv);
        }
        return this._dictionaries[dictId];
    }

    /**
     * @description Prepare array of marked records for group operation
     * @param recursive if true adds all loaded children into array
     */
    private _getMarkedRecords(recursive = false): any[] {
        const records: any[] = [];

        this._nodes.forEach((node) => {
            if (node.marked) {
                if (recursive) {
                    node.getAllChildren().forEach((chld) => records.push(chld.data.rec));
                }
                records.push(node.data.rec);
            }
        });
        return records;
    }

    private _resetMarked() {
        this._nodes.forEach((node) => {
            if (node.marked) {
                node.marked = false;
            }
        });
    }

    search(criteries: any[]): Promise<EosDictionaryNode[]> {
        return this.descriptor
            .search(criteries)
            .then((data) => this.updateNodes(data, false));
    }

    searchByParentData(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        if (dictionary.id === 'departments') {
            const critery = {
                'DUE': node.id
            }
            return this.search([critery]);
        }
        return Promise.resolve([]);
    }

    getSearchCriteries(search: string, params: ISearchSettings, selectedNode?: EosDictionaryNode): any[] {
        const _searchFields = this.descriptor.record.getFieldSet(E_FIELD_SET.search);
        const _criteries = _searchFields.map((fld) => {
            const _crit: any = {
                [fld.foreignKey]: '"' + search + '"'
            };
            this._extendCritery(_crit, params, selectedNode);
            return _crit;
        });
        return _criteries;
    }

    getFullsearchCriteries(data: any, params: ISearchSettings, selectedNode?: EosDictionaryNode): any {
        const _criteries = this.descriptor.getFullSearchCriteries(data);
        this._extendCritery(_criteries, params, selectedNode);
        return _criteries;
    }


    getNodeUserOrder(nodeId: string): string[] {
        if (this._userOrder && this._userOrder[nodeId]) {
            return this._userOrder[nodeId];
        }
        return null;
    }

    getListView() {
        return this.descriptor.record.getListView({});
    }

    setNodeUserOrder(nodeId: string, order: string[]) {
        if (!this._userOrder) {
            this._userOrder = {};
        }
        this._userOrder[nodeId] = order;
    }

    reorderList(nodes: EosDictionaryNode[], parentId?: string): EosDictionaryNode[] {
        if (this._userOrdered) {
            return this._doUserOrder(nodes, parentId);
        } else {
            return this._orderByField(nodes);
        }
    }

    private _extendCritery(critery: any, params: ISearchSettings, selectedNode?: EosDictionaryNode) {
        if (this.descriptor.type !== E_DICT_TYPE.linear) {
            if (params.mode === SEARCH_MODES.totalDictionary) {
                // critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId.toString().split('.')[0] + '.%';
            } else if (params.mode === SEARCH_MODES.onlyCurrentBranch) {
                critery['ISN_HIGH_NODE'] = selectedNode.data.rec['ISN_NODE'] + '';
            } else if (params.mode === SEARCH_MODES.currentAndSubbranch) {
                const layer = selectedNode.originalId.toString().split('.').length - 1;
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId + '%';
                critery['LAYER'] = layer + ':Null';
            }
        }

        if (!params.deleted) {
            critery['DELETED'] = '0';
        }
    }

    private _doUserOrder(nodes: EosDictionaryNode[], parentId: string): EosDictionaryNode[] {
        const userOrderedIDs = this._userOrder ? this._userOrder[parentId] : null;
        if (userOrderedIDs) {
            const orderedNodes = [];
            userOrderedIDs.forEach((nodeId) => {
                const node = nodes.find((item) => item.id === nodeId);
                if (node) {
                    orderedNodes.push(node);
                }
            });
            nodes.forEach((node) => {
                if (orderedNodes.findIndex((item) => item.id === node.id) === -1) {
                    orderedNodes.push(node);
                }

            })
            return orderedNodes;
        }
        return nodes;
    }

    private _orderByField(nodes: EosDictionaryNode[]): EosDictionaryNode[] {
        const _orderBy = this._orderBy; // DON'T USE THIS IN COMPARE FUNC!!! IT'S OTHER THIS!!!
        return nodes.sort((a: EosDictionaryNode, b: EosDictionaryNode) => {
            let _a = a.data.rec[_orderBy.fieldKey];
            let _b = b.data.rec[_orderBy.fieldKey];

            if (typeof _a === 'string' || typeof _b === 'string') {
                _a = (_a + '').toLocaleLowerCase();
                _b = (_b + '').toLocaleLowerCase();
            }
            if (_a > _b) {
                return _orderBy.ascend ? 1 : -1;
            }
            if (_a < _b) {
                return _orderBy.ascend ? -1 : 1;
            }
            if (_a === _b) {
                return 0;
            }
        });
    }
}
