import { EosDictionaryNode } from './eos-dictionary-node';

export class EosDictionary {
    readonly id: string;
    public title: string;
    private _rootNodes: EosDictionaryNode[];
    private _nodes: Map<number, EosDictionaryNode>;

    constructor(id: string) {
        this._nodes = new Map<number, EosDictionaryNode>();
        this.id = id;
        this._rootNodes = [];
    }

    init(title: string, nodes: EosDictionaryNode[]) {
        this.title = title;
        this._nodes.clear();
        this._rootNodes.splice(0, this._rootNodes. length);

        nodes.forEach((node) => {
            this._nodes.set(node.id, node);
            if (!node.parent) {
                this._rootNodes.push(node);
            } else {
                const parent = this._nodes.get(node.parent.id);
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        });
    }

    /* return dictionary root nodes */
    get rootNodes(): EosDictionaryNode[] {
        return this._rootNodes;
    }

    setChildren(parentId: number, children: EosDictionaryNode[]) {
        const parent = this._nodes.get(parentId);
        parent.children = children;
        children.forEach((node) => {
            node.parent = parent;
            this._nodes.set(node.id, node);
        });
    }

    /* get children nodes or first level nodes if parentNodeId is not specified */
    getChildrenNodes(parentNodeId?: number): EosDictionaryNode[] {
        if (typeof parentNodeId === 'undefined') {
            return this._rootNodes;
        }
        // TODO: load children and return them
        return [];
        // const node = this._rootNodes.get(parentNodeId);
        // return node && node.children;
    }

    getNode(nodeId: number): EosDictionaryNode {
        return this._nodes.get(nodeId);
    }

    addNode(node: EosDictionaryNode, parentId?: number): boolean {
        let _result = false;

        // check that node with specified id does not exist in this instance
        if (!this._nodes.has(node.id)) {
            this._nodes.set(node.id, node);
            if (!isNaN(+parentId)) {
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

    deleteNode(nodeId: number, hard = false): boolean {
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

}
