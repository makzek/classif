import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { SortableComponent } from 'ngx-bootstrap';

import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent {
    @Input() nodes: EosDictionaryNode[];
    @Input() params: any;
    @Output() change: EventEmitter<any> = new EventEmitter<any>(); // changes in list
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;

    constructor(
        private _orderSrv: EosDictOrderService,
    ) { }

    checkState() {
        this.change.emit();
    }

    toggleItem(e) {
        // console.log(this.nodes);
        /* comment it, pls
        const from = (this.currentPage - 1) * this.itemsPerPage;
        let before = this.currentPage * this.itemsPerPage - 1;
        if (before > this.sortableNodes.length) {
            before = this.sortableNodes.length - 1;
        }
        */
        if (this.nodes.length) {
            /*
            for (let i = from, j = 0; i <= before; i++ , j++) {
                this.sortableNodes[i] = this.nodeListPerPage[j];
            }
            */
            // Генерируем порядок
            this._orderSrv.generateOrder(this.nodes, this.nodes[0].parentId);
        }
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
            this._orderSrv.generateOrder(nodes, nodes[0].parentId);
        }
    }

}


