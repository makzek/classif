import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView } from '../core/field-descriptor';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})
export class NodeInfoComponent implements OnDestroy {
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;

    private _openedNodeSubscription: Subscription;

    updating: boolean;

    constructor(private _dictSrv: EosDictService,
        private _nodeActSrv: NodeActionsService) {

        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe(
            (node) => {
                if (node) {
                    this.viewFields = node.getQuickView();
                    this.shortViewFields = node.getShortQuickView();
                    this.updating = node.updating;
                }
            },
            (error) => alert(error));
    }

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
    }

    actionHandler(type: E_RECORD_ACTIONS) {
        this._nodeActSrv.emitAction(type);
    }
}
