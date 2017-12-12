import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IFieldView } from '../core/dictionary.interfaces';
import { EosDictService } from '../services/eos-dict.service';
import { E_RECORD_ACTIONS } from '../core/record-action';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    // viewFields: IFieldView[];
    // shortViewFields: IFieldView[];
    updating = false;
    fieldsDescriptionShort: any = {};
    nodeDataShort: any = {};
    fieldsDescriptionFull: any = {};
    nodeDataFull: any = {};

    dictionaryId: string;
    bossName = '';

    private _openedNodeSubscription: Subscription;
    private _dictSubscription: Subscription;

    constructor(private _dictSrv: EosDictService) {
        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe((node) => {
            if (node) {
                this.dictionaryId = node.dictionaryId;
                this.updating = node.updating;

                this.fieldsDescriptionShort = node.getShortViewFieldsDescription();
                this.nodeDataShort = node.getShortViewData();
                this.fieldsDescriptionFull = node.getFullViewFieldsDescription();
                this.nodeDataFull = node.getFullViewData();
                // console.log('fieldsDescriptionFull', this.fieldsDescriptionFull);
                if (this.dictionaryId === 'departments' && !node.data.rec['IS_NODE'] && node.children) {
                    const _boss = node.children.find((_chld) => _chld.data.rec['POST_H']);
                    if (_boss) {
                        this.bossName = _boss.data.rec['SURNAME'];
                    } else {
                        this.bossName = '';
                    }
                }
            }
        }, (error) => alert(error));
        this._dictSubscription = this._dictSrv.dictionary$.subscribe((dict) => {
            if (dict && dict.id !== this.dictionaryId) {
                this.fieldsDescriptionFull = {};
                this.fieldsDescriptionShort = {};
                this.nodeDataFull = {};
                this.nodeDataShort = {};
            }
        });
    }

    ngOnDestroy() {
        this._openedNodeSubscription.unsubscribe();
        this._dictSubscription.unsubscribe();
    }

    onAction(action: E_RECORD_ACTIONS) {
        this.action.emit(action);
    }

}
