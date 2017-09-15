import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { DictionaryActionService, DICTIONARY_ACTIONS, DICTIONARY_STATES } from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy {
    private _dictionaryId: string;
    public nodes: EosDictionaryNode[];

    hideTree = true;
    hideFullInfo = true;
    dictionaryName: string;

    constructor(private _dictionaryService: EosDictService,
        private route: ActivatedRoute,
        private _actionService: DictionaryActionService) {

        this.route.params.subscribe((params) => {
            if (params) {
                if (params.dictionaryId) {
                    _dictionaryService.openDictionary(params.dictionaryId)
                        .then(() => {
                            if (params.nodeId) {
                                _dictionaryService.selectNode(params.dictionaryId, params.nodeId);
                            }
                        });
                }
            }
        });

        this.nodes = [];

        this._dictionaryService.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                this.dictionaryName = dictionary.root.title;
                this.nodes = [dictionary.root];
            }
        });

        this._actionService.state$.subscribe((state) => {
            if (state !== null) {
                switch (state) {
                    case DICTIONARY_STATES.full:
                        this.hideTree = false;
                        this.hideFullInfo = false;
                        break;
                    case DICTIONARY_STATES.info:
                        this.hideTree = false;
                        this.hideFullInfo = true;
                        break;
                    case DICTIONARY_STATES.tree:
                        this.hideTree = true;
                        this.hideFullInfo = false;
                        break;
                    case DICTIONARY_STATES.selected:
                        this.hideTree = true;
                        this.hideFullInfo = true;
                        break;
                }
            }
        });

        this._actionService.action$.subscribe((action) => {
            switch (action) {
                case DICTIONARY_ACTIONS.closeTree:
                    this.hideTree = true;
                    break;
                case DICTIONARY_ACTIONS.openTree:
                    this.hideTree = false;
                    break;
                case DICTIONARY_ACTIONS.closeInfo:
                    this.hideFullInfo = true;
                    break;
                case DICTIONARY_ACTIONS.openInfo:
                    this.hideFullInfo = false;
                    break;
            }
        });

    }

    ngOnDestroy() {
        this._actionService.emitState(null);
        if (this.hideFullInfo && this.hideTree) {
            this._actionService.emitState(DICTIONARY_STATES.selected);
        }

        if (!this.hideFullInfo && this.hideTree) {
            this._actionService.emitState(DICTIONARY_STATES.info);
        }

        if (this.hideFullInfo && !this.hideTree) {
            this._actionService.emitState(DICTIONARY_STATES.tree);
        }

        if (!this.hideFullInfo && !this.hideTree) {
            this._actionService.emitState(DICTIONARY_STATES.full);
        }
    }

    /* ngOnInit() {
        if (!this.hideFullInfo) {
            this._actionService.emitAction(DICTIONARY_ACTIONS.openInfoActions);
        }
    }*/
}
