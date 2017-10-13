import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosUserProfileService } from '../..//app/services/eos-user-profile.service';

import { EosDictionaryNode } from '../core/eos-dictionary-node';
import {
    DictionaryActionService,
    DICTIONARY_ACTIONS,
    DICTIONARY_STATES
} from '../dictionary/dictionary-action.service';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-dictionary',
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy {

    public _selectedNode: EosDictionaryNode;
    public _params: any = {};

    public showDeleted: boolean;

    private _dictionaryId: string;
    private _nodeId: string;

    nodes: EosDictionaryNode[];
    // hideTree = true;
    // hideFullInfo = true;
    dictionaryName: string;

    currentState: number;
    readonly states = DICTIONARY_STATES;

    private _subscriptions: Subscription[];

    constructor(
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _actSrv: DictionaryActionService,
        private _profileSrv: EosUserProfileService,
    ) {
        this._route.params.subscribe((params) => {
            if (params) {
                this._dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                this._update();
            }
        });

        this.nodes = [];
        this._subscriptions = [];
        this._subscriptions.push(_dictSrv.dictionary$.subscribe((dictionary) => {
            if (dictionary) {
                this._dictionaryId = dictionary.id;
                if (dictionary.root) {
                    this.dictionaryName = dictionary.root.title;
                }
                this.nodes = [dictionary.root];
                this._params.showCheckbox = dictionary.descriptor.canDo(E_ACTION_GROUPS.common, E_RECORD_ACTIONS.markRecords);
            } else {
                this.nodes = [];
            }
        }));

        this._subscriptions.push(_actSrv.action$.subscribe((action) => {
            this._swichCurrentState(action);
        }));

        this._subscriptions.push(_profileSrv.settings$
            .map((settings) => settings.find((s) => s.id === 'showDeleted').value)
            .subscribe((s) => {
                this.showDeleted = s;
                this._params.showDeleted = s;

            })
        );

        this._subscriptions.push(this._dictSrv.selectedNode$.subscribe((node) => {
            this._selectedNode = node;
            /*
            if (node) {
                this.viewFields = node.getListView();
                this._update(node.children, true);
                if (!this.nodes) {
                    if (node.marked) {
                        this._actSrv.emitAction(E_RECORD_ACTIONS.markAllChildren);
                        this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
                    } else {
                        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkAllChildren);
                        this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
                    }
                } else {
                    this.checkState(node.marked);
                }
            }
            */
        }));

        this.currentState = this._actSrv.state;

    }

    private _swichCurrentState(action: DICTIONARY_ACTIONS) {
        this._actSrv.closeAll = false;
        switch (action) {
            // TODO: try to find more simple solition
            case DICTIONARY_ACTIONS.closeTree:
                switch (this.currentState) {
                    case DICTIONARY_STATES.full:
                        this.currentState = DICTIONARY_STATES.info;
                        break;
                    case DICTIONARY_STATES.tree:
                        this.currentState = DICTIONARY_STATES.selected;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.openTree:
                switch (this.currentState) {
                    case DICTIONARY_STATES.info:
                        this.currentState = DICTIONARY_STATES.full;
                        break;
                    case DICTIONARY_STATES.selected:
                        this.currentState = DICTIONARY_STATES.tree;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.closeInfo:
                switch (this.currentState) {
                    case DICTIONARY_STATES.full:
                        this.currentState = DICTIONARY_STATES.tree;
                        break;
                    case DICTIONARY_STATES.info:
                        this.currentState = DICTIONARY_STATES.selected;
                        break;
                }
                break;
            case DICTIONARY_ACTIONS.openInfo:
                switch (this.currentState) {
                    case DICTIONARY_STATES.tree:
                        this.currentState = DICTIONARY_STATES.full;
                        break;
                    case DICTIONARY_STATES.selected:
                        this.currentState = DICTIONARY_STATES.info;
                        break;
                }
                break;
        }
    }

    private _update() {
        if (this._dictionaryId) {
            this._dictSrv.openDictionary(this._dictionaryId)
                .then(() => {
                    this._dictSrv.selectNode(this._nodeId);
                });
        }
    }

    ngOnDestroy() {
        this._actSrv.emitAction(null);
        this._actSrv.state = this.currentState;
        this._subscriptions.forEach((_s) => _s.unsubscribe());
    }
}
