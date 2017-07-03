import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import 'rxjs/add/operator/filter';

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

        this.route.params.subscribe((params) => {
            if (params) {
                if (params.dictionaryId) {
                    _dictionaryService.openDictionary(params.dictionaryId)
                        .then(() => {
                            if (params.nodeId) {
                                _dictionaryService.selectNode(params.dictionaryId, params.nodeId);
                            }
                            if (params.openId) {
                                _dictionaryService.openNode(params.dictionaryId, params.nodeId);
                            }
                        });
                }
            }
        });
        /* what for? */
        this._dictionaryService.selectedNode$.subscribe((node) => {
            this.selectedNode = node;
        });

        this.nodes = [];

        this._dictionaryService.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                this.nodes = dictionary.rootNodes;
                console.log('roots', this.nodes);
            }
        });
    }

    /* it's event of tree-node only, not dictionary */
    selectNode(node: EosDictionaryNode) {
        this._dictionaryService.selectNode(this._dictionaryId, node.id);
    }
}
