import { EosDictionaryNode } from './eos-dictionary-node';
import { SEARCH_KEYS } from '../core/consts';

export class EosDictionary {
    readonly id: string;
    public title: string;
    root: EosDictionaryNode;
    private _rootNodes: EosDictionaryNode[];
    private _nodes: Map<string, EosDictionaryNode>;

    constructor(data: any) {
        this.id = data.id;
        this.root = new EosDictionaryNode({
            id: '',
            title: data.title,
            isNode: true,
            children: []
        })
        this._nodes = new Map<string, EosDictionaryNode>();
    }

    init(data: any[]) {
        this._nodes.clear();
        this.root.children = [];
        this.root.hasSubnodes = false;

        /* add nodes */
        data.forEach((nodeData) => {
            const node: EosDictionaryNode = new EosDictionaryNode(nodeData);
            this._nodes.set(node.id, node);
        });

        /* build tree */
        this._nodes.forEach((_node) => {
            if (_node.parentId) {
                const parent = this._nodes.get(_node.parentId);
                if (parent) {
                    _node.parent = parent;
                    if (!parent.children) {
                        parent.children = [];
                    }
                    /* tslint:disable:no-bitwise */
                    if (!~parent.children.findIndex((_chld) => _chld.id === _node.id)) {
                        parent.children.push(_node);
                    }
                    /* tslint:enable:no-bitwise */
                }
            }
        });

        /* build roots */
        this._nodes.forEach((_node) => {
            if (!_node.parent) {
                this.root.children.push(_node);
                _node.parent = this.root;
            }
        });

        this.root.hasSubnodes = this.root.children.length > 0;
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

    setChildren(parentId: string, children: EosDictionaryNode[]) {
        const parent = this._nodes.get(parentId);
        parent.children = children;
        children.forEach((node) => {
            node.parent = parent;
            this._nodes.set(node.id, node);
        });
    }

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
        let _result = false;

        // check that node with specified id does not exist in this instance
        if (!this._nodes.has(node.id)) {
            this._nodes.set(node.id, node);
            if (!parentId) {
                const _parent: EosDictionaryNode = this._nodes.get(parentId);

                if (_parent) {
                    if (!_parent.children) {
                        _parent.children = [];
                    }
                    _parent.children.push(node);
                    _result = true;
                }
            }
        }
        return _result;
    }

    deleteNode(nodeId: string, hard = false): boolean {
        let _result = false;
        const _node: EosDictionaryNode = this._nodes.get(nodeId);
        let _parent: EosDictionaryNode;

        if (_node) {
            if (hard) {
                if (!_node.children || _node.children.length < 1) {
                    _parent = _node.parent;
                    _parent.children = _parent.children.filter((_n) => _n.id !== _node.id);
                    this._nodes.delete(nodeId);
                    _result = true;
                }
            } else {
                _node.isDeleted = true;
                _result = true;
            }
        }

        return _result;
    }

    search(searchString: string, globalSearch: boolean, selectedNode?: EosDictionaryNode) {
        let searchResult = [];
            this._nodes.forEach((node) => {
                if ( !!~SEARCH_KEYS.findIndex((key) => !!~node[key].search(searchString))) {
                    searchResult.push(node);
                }
            });
        if (!globalSearch) {
            searchResult = searchResult.filter((node) => node.hasParent(selectedNode));
        }
        return searchResult;
    }

}
