import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { RECORD_ACTIONS, DROPDOWN_RECORD_ACTIONS } from '../consts/record-actions.consts';
import { IActionButton, IAction } from '../core/action.interface';
import { INodeListParams } from '../core/dictionary.interface';
import { EosDictOrderService } from '../services/eos-dict-order.service';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnChanges, OnDestroy {
    @Input() params: INodeListParams;
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    buttons: IActionButton[];
    ddButtons: IActionButton[];

    private dictionary: EosDictionary;
    private _dictionarySubscription: Subscription;

    constructor(_dictSrv: EosDictService,
        private _orderSrv: EosDictOrderService
    ) {
        this._dictionarySubscription = _dictSrv.dictionary$.subscribe((dict) => {
            this.dictionary = dict;
            this._update();
        });
    }

    ngOnChanges() {
        this._update();
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
    }

    private _update() {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));
    }

    private _actionToButton(action: IAction): IActionButton {
        let _enabled = false;
        let _active = false;

        if (this.dictionary && this.params) {
            _enabled = this.dictionary.descriptor.canDo(action.group, action.type);
            switch (action.type) {
                case E_RECORD_ACTIONS.moveUp:
                case E_RECORD_ACTIONS.moveDown:
                    _enabled = this.params.userSort && _enabled;
                    break;
                case E_RECORD_ACTIONS.restore:
                    _enabled = this.params.showDeleted && _enabled;
                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _active = this.params.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    _active = this.params.userSort;
                    this._orderSrv.setSortingMode(_active);
                    break;
            }
        }

        return Object.assign({
            isActive: _active,
            enabled: _enabled
        }, action);
    }

    doAction(action: IAction) {
        this.action.emit(action.type);
    }
}
