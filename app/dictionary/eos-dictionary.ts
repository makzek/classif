import { EosDictionaryNode } from './eos-dictionary-node';
export class EosDictionary {
    private _nodes: Map<number, EosDictionaryNode>;

    constructor() {
        this._nodes = new Map<number, EosDictionaryNode>();
    }

    init(nodes: EosDictionaryNode[]) {
        nodes.forEach(_n => this._nodes.set(_n.id, _n));
    }

    addNode(parentId: number, node: EosDictionaryNode): boolean {
        let _parent: EosDictionaryNode = this._nodes.get(parentId);
        let _success = false;

        if (_parent) {
            if (!_parent.children) {
                _parent.children = [];
            }
            _parent.children.push(node);
            this._nodes.set(node.id, node);
            _success = true;
        }

        return _success;
    }

    deleteNode(nodeId: number, hard = false): boolean {
        let _success = false;
        let _node: EosDictionaryNode = this._nodes.get(nodeId);
        let _parent: EosDictionaryNode;

        if (_node) {
            if (hard) {
                if (!_node.children || _node.children.length < 1) {
                    _parent = _node.parent;
                    _parent.children = _parent.children.filter(_n => _n.id !== _node.id);
                    this._nodes.delete(nodeId);
                    _success = true;
                }
            } else {
                _node.isDeleted = true;
                _success = true;
            }
        }

        return _success;
    }

}
