import { DictionaryDescriptor, E_FIELD_SET } from './dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';

export class EosDictionary {
    readonly id: string;
    descriptor: DictionaryDescriptor;
    public title: string;
    root: EosDictionaryNode;
    private _rootNodes: EosDictionaryNode[];
    private _nodes: Map<string, EosDictionaryNode>;

    constructor(descriptor: DictionaryDescriptor, data: any) {
        this.descriptor = descriptor;
        console.log('new dictionary', data);
        this.id = data.id;
        this.root = new EosDictionaryNode(this.descriptor.record, {
            [this.descriptor.record.keyField.key]: '',
            title: data.title,
        })
        this._nodes = new Map<string, EosDictionaryNode>();
    }

    init(data: any[]) {
        this._nodes.clear();
        this.root.children = [];

        /* add nodes */
        data.forEach((nodeData) => {
            const node: EosDictionaryNode = new EosDictionaryNode(this.descriptor.record, nodeData);
            this._nodes.set(node.id, node);
        });

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
        this._nodes.forEach((_node) => {
            if (!_node.parent) {
                this.root.addChild(_node);
            }
        });

        /* console.log('init dictionary', this._nodes); */
        /* console.log('roots', this._rootNodes); */
    }

    /* return dictionary root nodes */
    get rootNodes(): EosDictionaryNode[] {
        return this._rootNodes;
    }

    get nodes(): Map<string, EosDictionaryNode> {
        return this._nodes;
    }
    /*
    setChildren(parentId: string, children: EosDictionaryNode[]) {
        const parent = this._nodes.get(parentId);
        parent.children = children;
        children.forEach((node) => {
            node.parent = parent;
            this._nodes.set(node.id, node);
        });
    }
    */
    /* get children nodes or first level nodes if parentNodeId is not specified */
    getChildrenNodes(parentNodeId?: string): EosDictionaryNode[] {
        if (typeof parentNodeId === 'undefined') {
            return this._rootNodes;
        }
        // TODO: load children and return them
        return [];
        // const node = this._rootNodes.get(parentNodeId);
        // return node && node.children;
    }

    getNode(nodeId: string): EosDictionaryNode {
        const _res = this._nodes.get(nodeId);
        /* console.log('get node', this.id, nodeId, this._nodes, _res); */
        return _res;
    }

    addNode(node: EosDictionaryNode, parentId?: string): boolean {
        console.log('createNewNode does nothing yet because newNode.id === undefined ');
        let _result = false;

        // check that node with specified id does not exist in this instance
        if (!this._nodes.has(node.id)) {
            this._nodes.set(node.id, node);
            if (!parentId) {
                const _parent: EosDictionaryNode = this._nodes.get(parentId);

                if (_parent) {
                    _parent.addChild(node);
                    _result = true;
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

    search(searchString: string, globalSearch: boolean, selectedNode?: EosDictionaryNode): EosDictionaryNode[] {
        let searchResult = [];
        const _searchFields = this.descriptor.getFieldSet(E_FIELD_SET.search);
        /* tslint:disable:no-bitwise */
        this._nodes.forEach((node) => {
            if (!!~_searchFields.findIndex((fld) => !!~node.data[fld.key].search(RegExp(searchString, 'i')))) {
                searchResult.push(node);
            }
        });
        /* tslint:enable:no-bitwise */

        if (!globalSearch) {
            searchResult = searchResult.filter((node) => node.hasParent(selectedNode));
        }
        return searchResult;
    }

    fullSearch(queries: IFieldView[], searchInDeleted: boolean): EosDictionaryNode[] {
        const searchResult = [];

        this._nodes.forEach((node) => {
            if (!node.isDeleted || searchInDeleted) {
                let ok = true;
                queries.forEach((_q) => {
                    /* tslint:disable:no-bitwise */
                    if (_q.value && !~node.data[_q.key].search(_q.value) && ok) {
                        ok = false;
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
