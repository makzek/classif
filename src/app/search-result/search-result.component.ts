import { Component, Output, EventEmitter } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-search-result',
    templateUrl: 'search-result.component.html',
})
export class SearchResultComponent {
    nodes: EosDictionaryNode[];
    @Output() hasResult: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _dictionaryService: EosDictService) {
        this._dictionaryService.searchResults$.subscribe((nodes) => {
                this.nodes = nodes;
                this.hasResult.emit(this.nodes.length > 0);
                console.log(this.nodes);
            }
        );
    }
}
