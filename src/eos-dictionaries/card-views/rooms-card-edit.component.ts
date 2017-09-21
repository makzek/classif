// import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
// import { EosDictionaryNode } from '../core/eos-dictionary-node';
// import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/edit-card-action.service';
// import { EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from '../edit-card/edit-card-action.service';
import { CardEdit } from './card-edit';

@Component({
    selector: 'eos-rooms-card-edit',
    templateUrl: 'rooms-card-edit.component.html',
})
export class RoomsCardEditComponent extends CardEdit {

    constructor(private _d: EosDictService, private _a: EditCardActionService) {
        super(_d, _a);
    }

 /*   node: EosDictionaryNode;
    tmpObj: any = {};
    @Output() result: EventEmitter<any> = new EventEmitter<any>();
    editMode = true;
    showOwners = true;
    showUsers = true;
    showAccess = true;

    constructor(private _dictSrv: EosDictService, private _actSrv: EditCardActionService) {
        this._dictSrv.openedNode$.subscribe((node) => {
            this.node = node;
            if (this.node) {
                if (this.node.data) {
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        });
        this._actSrv.action$.subscribe(
            (act) => {
                switch (act) {
                    case EDIT_CARD_ACTIONS.save:
                    this.editMode = false;
                    this.result.emit(this.tmpObj);
                    break;
                    case EDIT_CARD_ACTIONS.cancel:
                    this.editMode = false;
                    this.result.emit(this.node.data);
                    Object.assign(this.tmpObj, this.node.data);
                    break;
                }
            }
        );
    }

    changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this._actSrv.emitMode(EDIT_CARD_MODES.edit);
        } else {
            this._actSrv.emitMode(EDIT_CARD_MODES.view);
        }
    }

    setUnsavedChanges() {
        this._actSrv.emitMode(EDIT_CARD_MODES.unsavedChanges);
    }*/
}
