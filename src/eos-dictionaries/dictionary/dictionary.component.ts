import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import {
    DictionaryActionService,
    DICTIONARY_ACTIONS,
   /* DICTIONARY_STATES*/
} from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy {
    private _dictionaryId: string;
    private _nodeId: string;

    nodes: EosDictionaryNode[];
    hideTree = true;
    hideFullInfo = true;
    dictionaryName: string;

    constructor(
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _actSrv: DictionaryActionService,
        private _profileSrv: EosUserProfileService
    ) {
        _profileSrv.authorized$.subscribe((auth) => {
            if (auth) {
                this._update();
            }
        });

        this._route.params.subscribe((params) => {
            if (params) {
                this._dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._update();
            }
        });

        this.nodes = [];

        this._dictSrv.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                if (dictionary.root) {
                    this.dictionaryName = dictionary.root.title;
                }
                this.nodes = [dictionary.root];
            }
        });

        /*  this._actSrv.state$.subscribe((state) => {
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
          });*/

        this._actSrv.action$.subscribe((action) => {
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

    private _update() {
        if (this._dictionaryId) {
            this._dictSrv.openDictionary(this._dictionaryId)
                .then(() => {
                    if (this._nodeId) {
                        this._dictSrv.selectNode(this._dictionaryId, this._nodeId);
                    }
                });
        }
    }

    openTree() {
        this.hideTree = !this.hideTree;
    }

    openInfo() {
        this.hideFullInfo = !this.hideFullInfo;
    }

    ngOnDestroy() {
        /*this._actSrv.emitState(null);
        if (this.hideFullInfo && this.hideTree) {
            this._actSrv.emitState(DICTIONARY_STATES.selected);
        }

        if (!this.hideFullInfo && this.hideTree) {
            this._actSrv.emitState(DICTIONARY_STATES.info);
        }

        if (this.hideFullInfo && !this.hideTree) {
            this._actSrv.emitState(DICTIONARY_STATES.tree);
        }

        if (!this.hideFullInfo && !this.hideTree) {
            this._actSrv.emitState(DICTIONARY_STATES.full);
        }*/
    }

    /* ngOnInit() {
        if (!this.hideFullInfo) {
            this._actionService.emitAction(DICTIONARY_ACTIONS.openInfoActions);
        }
    }*/
}
