import {
    E_DICT_TYPE,
    E_FIELD_SET,
    IDictionaryDescriptor,
    IDepartmentDictionaryDescriptor,
    ITreeDictionaryDescriptor,
    IFieldView
} from './dictionary.interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { TreeDictionaryDescriptor } from './tree-dictionary-descriptor';
import { DepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { ISearchSettings } from '../core/search-settings.interface';

import { IOrderBy } from '../core/sort.interface'

export class EosDictionary {
    descriptor: AbstractDictionaryDescriptor;
    root: EosDictionaryNode;
    private _nodes: Map<string, EosDictionaryNode>;

    private _orderBy: IOrderBy;
    private _userOrder: any;
    private _userOrdered: boolean;
    private _orderedArray: { [parentId: string]: EosDictionaryNode[] };

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

    set userOrdered(userOrder: boolean) {
        this._userOrdered = userOrder;
    }

    set orderBy(order: IOrderBy) {
        this._orderBy = order;
    }

    set userOrder(userOrder: any) {
        this._userOrder = userOrder;
    }

    get orderedArray(): { [parentId: string]: EosDictionaryNode[] } {
        return this._orderedArray;
    }

    set orderedArray(order: { [parentId: string]: EosDictionaryNode[] }) {
        this._orderedArray = order;
    }

    constructor(descData: IDictionaryDescriptor) {
        switch (descData.dictType) {
            case E_DICT_TYPE.linear:
                this.descriptor = new DictionaryDescriptor(descData);
                break;
            case E_DICT_TYPE.tree:
                this.descriptor = new TreeDictionaryDescriptor(<ITreeDictionaryDescriptor>descData);
                break;
            case E_DICT_TYPE.department:
                this.descriptor = new DepartmentDictionaryDescriptor(<IDepartmentDictionaryDescriptor>descData);
                break;
            default:
                throw new Error('No API instance');
        }

        this._nodes = new Map<string, EosDictionaryNode>();

        this._orderBy = {
            ascend: true,
            fieldKey: 'WEIGHT'
        };
    }

    init(data: any[]) {
        this._nodes.clear();

        /* add nodes */
        this.updateNodes(data, true);
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
            this.root = new EosDictionaryNode(this, { IS_NODE: 0, POTECTED: 0 });
            this.root.children = [];
            this._nodes.set(this.root.id, this.root);
        }

        this.root.title = this.descriptor.title;

        this._nodes.forEach((_node) => {
            if (!_node.parent && _node !== this.root) {
                this.root.addChild(_node);
            }
        });
    }

    updateNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        const _nodes: EosDictionaryNode[] = [];
        data.forEach((nodeData) => {
            if (nodeData) {
                const nodeId = nodeData[this.descriptor.record.keyField.key];
                let _node = this._nodes.get(nodeId);
                if (_node) {
                    _node.updateData(nodeData);
                } else {
                    _node = new EosDictionaryNode(this, nodeData);
                    this._nodes.set(_node.id, _node);
                }
                _nodes.push(_node);
            } else {
                console.log('no data');
            }
        });
        if (updateTree) {
            this._updateTree();
        }
        return _nodes;
    }

    getNode(nodeId: string): EosDictionaryNode {
        const _res = this._nodes.get(nodeId);
        // console.log('get node', this.id, nodeId, this._nodes, _res);
        return _res;
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
                    this.getNode(parentId).addChild(node);
                }
            }
        }
        return _result;
    }

    deleteNode(nodeId: string, hard = false): boolean {
        let _result = false;
        const _node: EosDictionaryNode = this._nodes.get(nodeId);
        if (_node) {
            _node.delete(hard);
            if (hard) {
                _result = _node.isDeleted;
                if (_result) {
                    this._nodes.delete(nodeId);
                }
            } else {
                _result = _node.isDeleted;
            }
        }

        return _result;
    }

    getSearchCriteries(search: string, params: ISearchSettings, selectedNode?: EosDictionaryNode): any[] {
        const _searchFields = this.descriptor.getFieldSet(E_FIELD_SET.search);
        const _criteries = _searchFields.map((fld) => {
            const _crit: any = {
                [fld.foreignKey]: '%' + search + '%'
            };
            this._extendCritery(_crit, params, selectedNode);
            return _crit;
        });
        return _criteries;
    }

    getFullsearchCriteries(data: any, params: ISearchSettings, selectedNode?: EosDictionaryNode): any {
        const critery = {};
        const fields = this.descriptor.getFieldSet(E_FIELD_SET.fullSearch);
        fields.forEach((fld) => {
            if (data[fld.key]) {
                critery[fld.foreignKey] = '%' + data[fld.key] + '%';
            }
        })
        this._extendCritery(critery, params, selectedNode);
        return critery;
    }

    private _extendCritery(critery: any, params: ISearchSettings, selectedNode?: EosDictionaryNode) {
        if (this.descriptor.type !== E_DICT_TYPE.linear) {
            if (params.onlyCurrentNode) {
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId
            } else if (params.subbranches) {
                critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId + '%'
            }
        }
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

    __orderBy(order: IOrderBy, userOrder = false) {
        this._orderBy = order;
        this._userOrdered = userOrder;
        this.reorder();
    }

    reorder() {
        this.nodes.forEach((node) => this.reorderNode(node));
    }

    reorderNode(node: EosDictionaryNode) {
        if (node.children) {
            if (this._userOrdered) {
                node.children = this._doUserOrder(node.children, node.id);
            } else {
                node.children = this._orderByField(node.children);
            }
        }
    }

    reorderList(nodes: EosDictionaryNode[]): EosDictionaryNode[] {
        return this._orderByField(nodes);
    }

    private _order(nodes: EosDictionaryNode[], parentId?: string) {
        if (this._userOrdered && parentId) {
            return this._orderedArray[parentId];
        } else {
            return this._orderByField(nodes);
        }
    }

    private _orderByField(array: EosDictionaryNode[]): EosDictionaryNode[] {
        const _orderBy = this._orderBy; // DON'T USE THIS IN COMPARE FUNC!!! IT'S OTHER THIS!!!
        return array.sort((a: EosDictionaryNode, b: EosDictionaryNode) => {
            if (a.data[_orderBy.fieldKey] > b.data[_orderBy.fieldKey]) {
                return _orderBy.ascend ? 1 : -1;
            }
            if (a.data[_orderBy.fieldKey] < b.data[_orderBy.fieldKey]) {
                return _orderBy.ascend ? -1 : 1;
            }
            if (a.data[_orderBy.fieldKey] === b.data[_orderBy.fieldKey]) {
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
                    userOrderedIDs.push(node);
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
    /*
    private restoreOrder(list: EosDictionaryNode[], ID: string): EosDictionaryNode[] {
        const order: string[] = this._storageSrv.getItem(ID + this.ORDER_NAME);
        const sortableList: EosDictionaryNode[] = [];
        for (const id of order) {
            for (const notSortedItem of list) {
                if (notSortedItem.id === id) {
                    sortableList.push(notSortedItem);
                    break;
                }
            }
        }
        for (const item of list) {
            const index = sortableList.indexOf(item);
            if (index === -1) {
                sortableList.push(item);
            }
        }
        return sortableList;
    }

    public getUserOrder(list: EosDictionaryNode[]): { [parentId: string]: EosDictionaryNode[] } {

        const _currentSort = this._storageSrv.getItem(this.dictionary.id + this.ORDER_NAME)
        if (!_currentSort) {
            this._storageSrv.setItem(this.dictionary.id + this.ORDER_NAME, {}, true);
        }
        if (_currentSort[list[0].parentId]) {
            _currentSort[list[0].parentId] = this.restoreOrder(list, list[0].parentId)
            return _currentSort;
        } else {
            _currentSort[list[0].parentId] = this.generateOrder(list, list[0].parentId);
            return _currentSort;
        }

    }
    */

}
