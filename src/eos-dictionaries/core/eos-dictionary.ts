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

export class EosDictionary {
    descriptor: AbstractDictionaryDescriptor;
    root: EosDictionaryNode;
    private _nodes: Map<string, EosDictionaryNode>;

    get id(): string {
        return this.descriptor.id;
    }

    get title(): string {
        return this.descriptor.title;
    }

    get nodes(): Map<string, EosDictionaryNode> {
        return this._nodes;
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
    }

    init(data: any[]) {
        this._nodes.clear();

        /* add nodes */
        this.updateNodes(data);
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
            this.root = new EosDictionaryNode(this.descriptor.record, { IS_NODE: 0, POTECTED: 0 });
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
                    _node = new EosDictionaryNode(this.descriptor.record, nodeData);
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

    /* todo: search with API */
    fullSearch(queries: IFieldView[], searchInDeleted: boolean): EosDictionaryNode[] {
        const searchResult = [];

        this._nodes.forEach((node) => {
            if (!node.isDeleted || searchInDeleted) {
                let ok = true;
                queries.forEach((_q) => {
                    /* tslint:disable:no-bitwise */
                    if (_q.value) {
                        const h = _q.value.replace(/[*+.?^${}()|[\]\\]/g, '\\$&');
                        if (!node.data[_q.key]) {
                            node.data[_q.key] = '';
                        }
                        if (!~node.data[_q.key].search(h) && ok) {
                            ok = false;
                        }
                    }
                    /* tslint:enable:no-bitwise */
                });
                if (ok) {
                    searchResult.push(node);
                }
            }

        });

        return searchResult;
    }

}
