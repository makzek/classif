import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';
import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    public updating: boolean;
    fieldsDescriptionShort: any = {};
    nodeDataShort: any = {};
    fieldsDescriptionFull: any = {};
    nodeDataFull: any = {};

    dictionaryId: string;
    bossName = '';

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(_dictSrv: EosDictService) {
        this._initInfo();
        _dictSrv.openedNode$.takeUntil(this.ngUnsubscribe)
            .subscribe((node) => {
                if (node) {
                    this.dictionaryId = node.dictionaryId;
                    this.fieldsDescriptionShort = node.getShortViewFieldsDescription();
                    this.nodeDataShort = node.getShortViewData();
                    this.fieldsDescriptionFull = node.getFullViewFieldsDescription();
                    this.nodeDataFull = node.getFullViewData();

                    if (this.dictionaryId === 'departments' && !node.data.rec['IS_NODE'] && node.children) {
                        const _boss = node.children.find((_chld) => _chld.data.rec['POST_H']);
                        if (_boss) {
                            this.bossName = _boss.data.rec['SURNAME'];
                        } else {
                            this.bossName = '';
                        }
                    }
                } else {
                    this._initInfo();
                }
            });
        _dictSrv.viewParameters$.takeUntil(this.ngUnsubscribe)
            .subscribe(viewParams => this.updating = viewParams.updatingInfo);
    }

    ngOnDestroy() {
    }

    onAction(action: E_RECORD_ACTIONS) {
        this.action.emit(action);
    }

    private _initInfo() {
        this.dictionaryId = null;
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};
    }
}
