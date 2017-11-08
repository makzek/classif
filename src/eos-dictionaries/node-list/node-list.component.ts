import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { SortableComponent } from 'ngx-bootstrap';

import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent {
    @Input() nodes: EosDictionaryNode[];
    @Input() params: any;
    @Input() length: any;
    @Output() checked: EventEmitter<any> = new EventEmitter<any>(); // changes in checkboxes
    @Output() reordered: EventEmitter<EosDictionaryNode[]> = new EventEmitter<EosDictionaryNode[]>(); // user order event
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;

    checkState() {
        this.checked.emit();
    }

    toggleItem() {
        this.reordered.emit(this.nodes);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }
}
