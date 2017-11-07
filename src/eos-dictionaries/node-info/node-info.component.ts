import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView, E_FIELD_TYPE } from '../core/dictionary.interfaces';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})
export class NodeInfoComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;
    fieldTypes = E_FIELD_TYPE;

    private _openedNodeSubscription: Subscription;

    updating = false;

    constructor(private _dictSrv: EosDictService) {
        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe((node) => {
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
        this.action.emit(type);
    }
}
