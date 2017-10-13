import { Component, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictService } from '../services/eos-dict.service';
import {
    DictionaryActionService,
    DICTIONARY_ACTIONS
} from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent implements OnDestroy {
    public _selectedNode: EosDictionaryNode;
    private _subscription: Subscription;
    constructor(private _dictSrv: EosDictService, private _dictActSrv: DictionaryActionService) {
        this._subscription = this._dictSrv.selectedNode$.subscribe((node) => {
            this._selectedNode = node;
        });
    }

    @HostListener('click') onClick() {
        if (window.innerWidth <= 1500) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
            this._dictActSrv.closeAll = true;
        }
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
