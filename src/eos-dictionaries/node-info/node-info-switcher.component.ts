import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IFieldView, E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    node: EosDictionaryNode;
    fieldsDescriptionShort: any = {};
    nodeDataShort: any = {};
    fieldsDescriptionFull: any = {};
    nodeDataFull: any = {};

    dictionaryId: string;
    bossName = '';

    private _openedNodeSubscription: Subscription;
    private _dictSubscription: Subscription;

    constructor(private _dictSrv: EosDictService) {
        this._initInfo();

        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe((node) => {
            if (node) {
                this.node = node;
                this.dictionaryId = node.dictionaryId;
                this.fieldsDescriptionShort = node.getShortViewFieldsDescription();
                this.nodeDataShort = node.getShortViewData();
                this.fieldsDescriptionFull = node.getFullViewFieldsDescription();
                this.nodeDataFull = node.getFullViewData();

                console.log('fds', this.fieldsDescriptionShort);
                console.log('short data', this.nodeDataShort);
                console.log('fdf', this.fieldsDescriptionFull);
                console.log('full data', this.nodeDataFull);

                if (this.dictionaryId === 'departments' && !node.data.rec['IS_NODE'] && node.children) {
                }
            } else {
                this._initInfo();
            }
        });
    }

    private _initInfo() {
        this.node = null;
        this.dictionaryId = null;
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};
    }

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
    }

    onAction(action: E_RECORD_ACTIONS) {
        this.action.emit(action);
    }

}
