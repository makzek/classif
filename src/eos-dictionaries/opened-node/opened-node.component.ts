import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView } from '../core/field-descriptor';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent implements OnDestroy {
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;

    private _openedNodeSubscription: Subscription;

    constructor(private _dictSrv: EosDictService,
        private _nodeActSrv: NodeActionsService,
        private _dictActSrv: DictionaryActionService) {
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
        this._openedNodeSubscription  = this._dictSrv.openedNode$.subscribe(
            (node) => {
                if (node) {
                    this.viewFields = node.getQuickView();
                    this.shortViewFields = node.getShortQuickView();
                }
            },
            (error) => alert(error));
    }

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
    }

    actionHandler (type: E_RECORD_ACTIONS) {
        this._nodeActSrv.emitAction(type);
    }

    openInfo() {
        console.log('dictionary open info');
        this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
     }
}
