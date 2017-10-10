import { DictionaryDescriptor, E_FIELD_SET, IDictionaryDescriptor } from './dictionary-descriptor';
import { RubricatorDictionaryDescriptor /*, IRubricatorDictionaryDescriptor*/ } from './rubricator-dictionary-descriptor';
import { DepartmentDictionaryDescriptor, IDepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
import { DICT_API_INSTANCES } from '../consts/dictionaries.consts';
import { EosDictionaryNode } from './eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';

export class EosDictionary {
    descriptor: DictionaryDescriptor;
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
        switch (descData.apiInstance) {
            case DICT_API_INSTANCES.rubricator:
                this.descriptor = new RubricatorDictionaryDescriptor(descData);
                break;
            case DICT_API_INSTANCES.department:
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
                this.root.title = this.descriptor.title;
            }
        });

        /* fallback if root undefined */
        if (!this.root) {
            this.root = new EosDictionaryNode(this.descriptor.record, { title: this.descriptor.title });
            this.root.children = [];
        }

        this._nodes.forEach((_node) => {
            if (!_node.parent && _node !== this.root) {
                this.root.addChild(_node);
            }
        });
    }

    updateNodes(data: any[]) {
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
            } else {
                console.log('no data');
            }
        });

        this._updateTree();
    }

    getNode(nodeId: string): EosDictionaryNode {
        const _res = this._nodes.get(nodeId);
        /* console.log('get node', this.id, nodeId, this._nodes, _res); */
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

    /* todo: search with API */
    search(searchString: string, globalSearch: boolean, selectedNode?: EosDictionaryNode): EosDictionaryNode[] {
        let searchResult: EosDictionaryNode[] = [];
        const _searchFields = this.descriptor.getFieldSet(E_FIELD_SET.search);
        searchString = searchString.replace(/[*+.?^${}()|[\]\\]/g, '\\$&');
        const _expr = new RegExp(searchString, 'i');

        /* tslint:disable:no-bitwise */
        this._nodes.forEach((node) => {
            if (!!~_searchFields.findIndex((fld) => _expr.test(node.data[fld.key]))) {
                searchResult.push(node);
            }
        });
        /* tslint:enable:no-bitwise */

        if (!globalSearch) {
            searchResult = searchResult.filter((node) => node.isChildOf(selectedNode));
        }
        return searchResult;
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
