import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { IFieldView, E_RECORD_ACTIONS, IDictionaryViewParameters } from 'eos-dictionaries/interfaces';
import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    // viewFields: IFieldView[];
    // shortViewFields: IFieldView[];
    private ngUnsubscribe: Subject<any> = new Subject();
    public updating: boolean;
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
        _dictSrv.openedNode$.takeUntil(this.ngUnsubscribe)
            .subscribe((node) => {
                if (node) {
                    this.dictionaryId = node.dictionaryId;
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
                } else {
                    this._initInfo();
                }
            });

        _dictSrv.viewParameters$.takeUntil(this.ngUnsubscribe)
            .subscribe(viewParams => this.updating = viewParams.updatingInfo);
    }

    private _initInfo() {
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};
    }

    ngOnDestroy() {
    }

    onAction(action: E_RECORD_ACTIONS) {
        this.action.emit(action);
    }

}
