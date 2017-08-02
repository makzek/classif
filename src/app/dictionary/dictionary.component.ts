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

    constructor(private _dictionaryService: EosDictService, private route: ActivatedRoute) {

        this.route.params.subscribe((params) => {
            if (params) {
                if (params.dictionaryId) {
                    _dictionaryService.openDictionary(params.dictionaryId)
                        .then(() => {
                            _dictionaryService.selectNode(params.dictionaryId, params.nodeId);
                        });
                }
            }
        });

        this.nodes = [];

        this._dictionaryService.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                this.nodes = [dictionary.root];
            }
        });
    }
}
