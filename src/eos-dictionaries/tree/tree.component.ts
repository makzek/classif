import { Component, Input } from '@angular/core';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-tree',
    templateUrl: './tree.component.html'
})
export class TreeComponent {
    @Input() nodes: EosDictionaryNode[];
    @Input() selectedNode: any;

    onExpand(node: EosDictionaryNode) {
        node.isExpanded = !node.isExpanded;
    }
}
