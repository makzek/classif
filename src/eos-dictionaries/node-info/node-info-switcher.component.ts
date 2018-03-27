import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    node: EosDictionaryNode;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(private _dictSrv: EosDictService) {
        this._dictSrv.openedNode$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((node) => {
                this.node = node;
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onAction(action: E_RECORD_ACTIONS) {
        this.action.emit(action);
    }
}
