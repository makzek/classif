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
    private _dictionaryId: string;
    public nodes: EosDictionaryNode[];
    public selectedNode: EosDictionaryNode;
    public openedNode: EosDictionaryNode;

    constructor(private _dictionaryService: EosDictService, private route: ActivatedRoute) {
        this.route.params.subscribe((params) => this._handleRoute(params));
        this._dictionaryService.selectedNode$.subscribe((node) => {
            this.selectedNode = node;
        });
        this.nodes = [];
        this._dictionaryService.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                this.nodes = dictionary.rootNodes;
            }
        });
    }

    _handleRoute(params: Params) {
        this._dictionaryService.openDictionary(params.dictionaryId);
    }

    loadChildrenNodes(parentId: number) {
        this._dictionaryService.loadChildrenNodes(parentId);
    }

    selectNode(node: EosDictionaryNode) {
        this._dictionaryService.selectNode(this._dictionaryId, node.id);
    }
}
