import { Component, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { RECORD_ACTIONS, DROPDOWN_RECORD_ACTIONS, MORE_RECORD_ACTIONS, SHOW_ALL_SUBNODES } from '../consts/record-actions.consts';
import { IActionButton, IAction, IDictionaryViewParameters, E_DICT_TYPE, E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';

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
    showSubnodesBtn: IActionButton;
    ctx = { item: this.showSubnodesBtn };
    showMore = false;

    private dictionary: EosDictionary;
    private _nodeSelected = false;
    private _viewParams: IDictionaryViewParameters;

    constructor(_dictSrv: EosDictService) {
        this._initButtons();

        _dictSrv.listDictionary$
            .takeUntil(this.ngUnsubscribe)
            .combineLatest(_dictSrv.openedNode$)
            .subscribe(([dict, node]) => {
                this.dictionary = dict;
                this._nodeSelected = !!node;
                this._viewParams = _dictSrv.viewParameters;
                this._update();
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private _initButtons() {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.ddButtons = DROPDOWN_RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.moreButtons = MORE_RECORD_ACTIONS.map(act => this._actionToButton(act));
        this.showSubnodesBtn = this._actionToButton(SHOW_ALL_SUBNODES);
    }

    private _update() {
        this.buttons.forEach(btn => this._updateButton(btn));
        this.ddButtons.forEach(btn => this._updateButton(btn));
        this.moreButtons.forEach(btn => this._updateButton(btn));
        this._updateButton(this.showSubnodesBtn);
    }

    private _updateButton(button: IActionButton) {
        let _enabled = true;
        let _active = false;
        let _show = false;

        if (this.dictionary && this._viewParams) {
            _show = this.dictionary.canDo(button.type);
            switch (button.type) {
                case E_RECORD_ACTIONS.add:
                    _enabled = !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.moveUp:
                    _show = this._viewParams.userOrdered && !this._viewParams.searchResults;
                    _enabled = this._nodeSelected && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.moveDown:
                    _show = this._viewParams.userOrdered && !this._viewParams.searchResults;
                    _enabled = this._nodeSelected && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.restore:
                    _enabled = this._viewParams.haveMarked && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _enabled = !this._viewParams.updating;
                    _active = this._viewParams.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    _enabled = !this._viewParams.searchResults && !this._viewParams.updating;
                    _active = this._viewParams.userOrdered;
                    break;
                case E_RECORD_ACTIONS.edit:
                    _enabled = _enabled && this._nodeSelected && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.remove:
                    _enabled = this._viewParams.haveMarked && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.removeHard:
                    _enabled = this._viewParams.haveMarked && !this._viewParams.updating;
                    break;
                case E_RECORD_ACTIONS.showAllSubnodes:
                    _enabled = !this._viewParams.searchResults && !this._viewParams.updating;
                    _active = this._viewParams.showAllSubnodes && !this._viewParams.searchResults;
                    break;
            }
        }
        button.show = _show;
        button.enabled = _enabled;
        button.isActive = _active;
    }

    toggleButtonList() {
        this.showMore = !this.showMore;
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

    doAction(action: E_RECORD_ACTIONS) {
        console.log('action', E_RECORD_ACTIONS[action]);
        this.action.emit(action);
    }
}
