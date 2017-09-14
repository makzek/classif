import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;

    constructor(private eosDictService: EosDictService,
        private _nodeActionService: NodeActionsService,
        private _dictionaryActionService: DictionaryActionService) {
        /* this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.eosDictService.openedNode$.subscribe(
                    (node) => {
                        if (node) {
                            this.viewFields = node.getQuickView();
                            this.shortViewFields = node.getShortQuickView();
                        }
                    },
                    (error) => alert(error));
            }
        });*/
        this.eosDictService.openedNode$.subscribe(
            (node) => {
                if (node) {
                    this.viewFields = node.getQuickView();
                    this.shortViewFields = node.getShortQuickView();
                }
            },
            (error) => alert(error));
    }

    actionHandler (type: E_RECORD_ACTIONS) {
        // console.log('actionHandler', E_RECORD_ACTIONS[type]);
        console.log('opened-node emit', E_RECORD_ACTIONS[type]);
        this._nodeActionService.emitAction(type);
    }

    openInfo() {
        console.log('dictionary open info');
        this._dictionaryActionService.emitAction(DICTIONARY_ACTIONS.closeInfo);
     }
}
