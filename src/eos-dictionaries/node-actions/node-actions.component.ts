import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { RECORD_ACTIONS, DROPDOWN_RECORD_ACTIONS, MORE_RECORD_ACTIONS} from '../consts/record-actions.consts';
import { IActionButton, IAction } from '../core/action.interface';
import { INodeListParams } from '../core/node-list.interfaces';
import { EosDictOrderService } from '../services/eos-dict-order.service';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnChanges, OnDestroy {
    @Input('params') params: INodeListParams;
    @Output('action') action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    buttons: IActionButton[];
    ddButtons: IActionButton[];
    moreButtons: IActionButton[];
    showMore = false;

    private dictionary: EosDictionary;
    private _dictionarySubscription: Subscription;

    constructor(_dictSrv: EosDictService,
        private _orderSrv: EosDictOrderService
    ) {
        this._initButtons();
        this._dictionarySubscription = _dictSrv.dictionary$.subscribe((dict) => {
            this.dictionary = dict;
            this._update();
        });
    }

    ngOnChanges() {
        setTimeout(this._update(), 0);
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
    }

    private _initButtons() {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.moreButtons = MORE_RECORD_ACTIONS.map(act => this._actionToButton(act));
    }

    private _update() {
        this.buttons.forEach((btn) => this._updateButton(btn));
        this.ddButtons.forEach((btn) => this._updateButton(btn));
    }

    private _updateButton(button: IActionButton) {
        let _enabled = false;
        let _active = false;

        if (this.dictionary && this.params) {
            _enabled = this.dictionary.descriptor.canDo(button.group, button.type);
            switch (button.type) {
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
        button.enabled = _enabled;
        button.isActive = _active;
    }

    private _actionToButton(action: IAction): IActionButton {
        const _btn = Object.assign({
            isActive: false,
            enabled: false
        }, action);
        this._updateButton(_btn);
        return _btn;
    }

    doAction(action: IAction) {
        this.action.emit(action.type);
    }
}
