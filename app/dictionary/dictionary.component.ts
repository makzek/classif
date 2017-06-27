import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent {
    private _dictionary: EosDictionary;
    nodes: EosDictionaryNode[];
    selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;

    constructor(private _dictionaryService: EosDictService, private route: ActivatedRoute) {
        this.route.params.subscribe((params) => this._handleRoute(params));
        this.nodes = [];
        this._dictionaryService.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this.nodes = dictionary.rootNodes;
            }
        });
    }

    _handleRoute(params: Params) {
        const { dictionaryId } = params;
        this._dictionaryService.openDictionary(params.dictionaryId);
    }

    loadChildrenNodes(parentId: number) {
        console.log('DictionaryComponent loadChildrenNodes', parentId);
        this._dictionaryService.loadChildrenNodes(parentId);
    }
}
