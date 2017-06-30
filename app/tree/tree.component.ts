import {Component, EventEmitter, Input, Output } from '@angular/core';

import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-tree',
    templateUrl: 'tree.component.html',
})
export class TreeComponent {
    @Input() nodes: EosDictionaryNode[];
    @Input() selectedNode: any;
    // @Input() baseRoute: string;

    @Output() onSelectNode: EventEmitter<EosDictionaryNode> = new EventEmitter<EosDictionaryNode>();
    // @Output() getNodes: EventEmitter<number> = new EventEmitter<number>();
    @Output() onRequestChildNodes: EventEmitter<number> = new EventEmitter<number>();

    onSelect(node: EosDictionaryNode) {
        this.onSelectNode.emit(node);
    }

    onExpand(node: EosDictionaryNode) {
        node.isExpanded = !node.isExpanded;
        // if (node.isExpanded && node.isNode && (!node.children || node.children.length === 0)) {
        this.onRequestChildNodes.emit(node.id);
        // }
    }

    // getNodes(parent: ITreeNode) {
    //     console.log('TreeComponent onRequestLocal');
    //     this.apiService.getRubrics(parent.id)
    //         .then((nodes) => {
    //             parent.children = nodes.map((node) => ({ ...node, isExpanded: false } as ITreeNode));
    //         })
    //         .catch(console.log);
    // }
}
