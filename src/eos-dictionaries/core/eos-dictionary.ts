import {
    E_DICT_TYPE,
    E_FIELD_SET,
    IDictionaryDescriptor,
    IDepartmentDictionaryDescriptor,
    ITreeDictionaryDescriptor,
    IFieldView,
    E_FIELD_TYPE
} from './dictionary.interfaces';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { TreeDictionaryDescriptor } from './tree-dictionary-descriptor';
import { DepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { ISearchSettings, SEARCH_MODES } from '../core/search-settings.interface';

import { IOrderBy } from '../core/sort.interface'
import { PipRX } from 'eos-rest/services/pipRX.service';
import { IEnt } from 'eos-rest';

export class EosDictionary {
    descriptor: AbstractDictionaryDescriptor;
    root: EosDictionaryNode;
    private _nodes: Map<string, EosDictionaryNode>;

    private _orderBy: IOrderBy;
    private _userOrder: any;
    private _userOrdered: boolean;
    private _orderedArray: { [parentId: string]: EosDictionaryNode[] };
    private _showDeleted: boolean;

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
        return this.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords)
    }

    constructor(descData: IDictionaryDescriptor, apiSrv: PipRX) {
        switch (descData.dictType) {
            case E_DICT_TYPE.linear:
                this.descriptor = new DictionaryDescriptor(descData, apiSrv);
                break;
            case E_DICT_TYPE.tree:
                this.descriptor = new TreeDictionaryDescriptor(<ITreeDictionaryDescriptor>descData, apiSrv);
                break;
            case E_DICT_TYPE.department:
                this.descriptor = new DepartmentDictionaryDescriptor(<IDepartmentDictionaryDescriptor>descData, apiSrv);
                break;
            default:
                throw new Error('No API instance');
        }

        this._nodes = new Map<string, EosDictionaryNode>();
        this.defaultOrder();
    }

    init(): Promise<EosDictionaryNode> {
        this._nodes.clear();
        return this.descriptor.getRoot()
            .then((data: any[]) => {
                this.updateNodes(data, true);
                // console.log('this.r00t', this.root, this._nodes);
                return this.root;
            })
    }

    initUserOrder(userOrdered: boolean, userOrder: any) {
        this._userOrdered = userOrdered;
        this._userOrder = userOrder;
    }

    private _updateTree() {
        /* build tree */
        this._nodes.forEach((_node) => {
            if (_node.parentId) {
                const parent = this._nodes.get(_node.parentId);
                if (parent) {
                    parent.addChild(_node);
                }
            }
        });

        /* build roots */
        this._nodes.forEach((_n) => {
            if (!this.root && _n.parentId === null) {
                this.root = _n;
            }
        });

        /* fallback if root undefined */
        if (!this.root) {
            this.root = new EosDictionaryNode(this, { IS_NODE: 0, POTECTED: 1 });
            this.root.children = [];
            this._nodes.set(this.root.id, this.root);
        }

        this.root.title = this.descriptor.title;
        this.root.data.rec['DELETED'] = false;

        this._nodes.forEach((node) => {
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
                if (_node) {
                    nodeIds.push(_node.id);
                }
            } else {
                console.log('no data');
            }
        });
        if (updateTree) {
            this._updateTree();
        }
        return nodeIds.map((id) => this._nodes.get(id))
            .filter((node) => !!node);
    }

    getFullNodeInfo(nodeId: string): Promise<EosDictionaryNode> {
        // console.log('getFullNodeInfo fired', nodeId);
        let id: any = nodeId;

        if (this.descriptor.record.keyField.type === E_FIELD_TYPE.number) {
            id = id * 1;
        }

        return this.descriptor.getRecord(id)
            .then((nodes) => {
                this.updateNodes(nodes, true);
                const node = this._nodes.get(nodeId);
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
        const nodeSet = this._getMarkedRecords(recursive);
        this._resetMarked();
        // 1 - mark deleted
        // 0 - unmark deleted
        return this.descriptor.markDeleted(nodeSet, ((deleted) ? 1 : 0));
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
    deleteMarked(): Promise<boolean> {
        const records = this._getMarkedRecords();
        this._nodes.forEach((node) => {
            if (node.marked) {
                node.delete();
                this._nodes.delete(node.id);
            }
        });
        this._resetMarked();
        return this.descriptor.deleteRecords(records);
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

    getSearchCriteries(search: string, params: ISearchSettings, selectedNode?: EosDictionaryNode): any[] {
        const _searchFields = this.descriptor.getFieldSet(E_FIELD_SET.search);
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
        const _searchFields = this.descriptor.getFieldSet(E_FIELD_SET.fullSearch);
        const _criteries = {}
        _searchFields.forEach((fld) => {
            if (data[fld.key]) {
                _criteries[fld.foreignKey] = '"' + data[fld.key] + '"';
            }
        })
        this._extendCritery(_criteries, params, selectedNode);
        return _criteries;
    }

    private _extendCritery(critery: any, params: ISearchSettings, selectedNode?: EosDictionaryNode) {
        if (this.descriptor.type !== E_DICT_TYPE.linear) {
            if (params.mode === SEARCH_MODES.totalDictionary) {
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId.toString().split('.')[0] + '.%';
            } else if (params.mode === SEARCH_MODES.onlyCurrentBranch) {
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId;
            } else if (params.mode === SEARCH_MODES.currentAndSubbranch) {
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId + '%';
            }
        }
        console.log('params', params);
        if (!params.deleted) {
            critery['DELETED'] = '0';
        }
    }


    getNodeUserOrder(nodeId: string): string[] {
        if (this._userOrder && this._userOrder[nodeId]) {
            return this._userOrder[nodeId];
        }
        return null;
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
}
