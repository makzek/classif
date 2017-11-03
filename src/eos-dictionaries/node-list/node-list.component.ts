import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { SortableComponent } from 'ngx-bootstrap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})

export class NodeListComponent {
    @Input() nodes: EosDictionaryNode[];
    @Input() params: any;
    @Input() length: any;
    @Output() change: EventEmitter<any> = new EventEmitter<any>(); // changes in list
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;

    constructor(
        private _dictSrv: EosDictService,
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
            this._dictSrv.generateOrder(this.nodes, this.nodes[0].parentId);
        }
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
            this._dictSrv.generateOrder(nodes, nodes[0].parentId);
        }
    }

}


