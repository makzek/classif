import { EosDictionaryNode } from './eos-dictionary-node';
export class EosDictionary {
    private _nodes: Map<number, EosDictionaryNode>;

    constructor() {
        this._nodes = new Map<number, EosDictionaryNode>();
    }

    init(nodes: EosDictionaryNode[]) {
        nodes.forEach((_n) => this._nodes.set(_n.id, _n));
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
                let _parent: EosDictionaryNode = this._nodes.get(parentId);

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
        let _node: EosDictionaryNode = this._nodes.get(nodeId);
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
