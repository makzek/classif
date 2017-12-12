import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { RECORD_ACTIONS, DROPDOWN_RECORD_ACTIONS, MORE_RECORD_ACTIONS } from '../consts/record-actions.consts';
import { IActionButton, IAction } from '../core/action.interface';
import { IDictionaryViewParameters } from 'eos-dictionaries/core/eos-dictionary.interfaces';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();

    // @Input('params') params: INodeListParams;
    @Output('action') action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    buttons: IActionButton[];
    ddButtons: IActionButton[];
    moreButtons: IActionButton[];
    showMore = false;

    private dictionary: EosDictionary;
    private _nodeSelected = false;
    private _viewParams: IDictionaryViewParameters;

    constructor(_dictSrv: EosDictService) {
        this._initButtons();

        _dictSrv.dictionary$
            .takeUntil(this.ngUnsubscribe)
            .combineLatest(_dictSrv.openedNode$, _dictSrv.viewParameters$)
            .subscribe(([dict, node, params]) => {
                this.dictionary = dict;
                this._nodeSelected = !!node;
                this._viewParams = params;
                this._update();
            });
        _dictSrv.viewParameters$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params) => {
                this._viewParams = params;
                this._update();
            })
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private _initButtons() {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.moreButtons = MORE_RECORD_ACTIONS.map(act => this._actionToButton(act));
    }

    private _update() {
        this.buttons.forEach(btn => this._updateButton(btn));
        this.ddButtons.forEach(btn => this._updateButton(btn));
        this.moreButtons.forEach(btn => this._updateButton(btn));
    }

    private _updateButton(button: IActionButton) {
        let _enabled = false;
        let _active = false;
        let _show = true;

        if (this.dictionary && this._viewParams) {
            _enabled = this.dictionary.descriptor.canDo(button.group, button.type);
            switch (button.type) {
                case E_RECORD_ACTIONS.moveUp:
                    _enabled = _enabled && this._nodeSelected;
                    _show = this._viewParams.userOrdered;
                    break;
                case E_RECORD_ACTIONS.moveDown:
                    _enabled = _enabled && this._nodeSelected;
                    _show = this._viewParams.userOrdered;
                    break;
                case E_RECORD_ACTIONS.restore:
                    _enabled = this._viewParams.showDeleted;
                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _active = this._viewParams.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    _active = this._viewParams.userOrdered;
                    _enabled = !this._viewParams.searchResults;
                    break;
                case E_RECORD_ACTIONS.edit:
                    _enabled = _enabled && this._nodeSelected;
                    break;
                case E_RECORD_ACTIONS.remove:
                    _enabled = this._viewParams.haveMarked;
                    break;
                case E_RECORD_ACTIONS.removeHard:
                    _enabled = this._viewParams.haveMarked;
                    break;
            }
        }
        button.show = _show;
        button.enabled = _enabled;
        button.isActive = _active;
    }

    private _actionToButton(action: IAction): IActionButton {
        const _btn = Object.assign({
            isActive: false,
            enabled: false,
            show: false
        }, action);
        this._updateButton(_btn);
        return _btn;
    }

    doAction(action: IAction) {
        this.action.emit(action.type);
    }
}
