import { Component, Output, Input, EventEmitter } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EditCardActionService } from '../edit-card/action.service';
import { EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from '../edit-card/action.service';
import { CardEdit } from './card-edit';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends CardEdit {
   // node: EosDictionaryNode;
    fieldGroups: string[];
    currTab = 0;
    /*tmpObj: any = {};
    @Output() result: EventEmitter<any> = new EventEmitter<any>();
    editMode = true;*/
    /* todo: define it or remove*/
   /* dictIdFromDescriptor: string;*/

    constructor(private _d: EosDictService, private _a: EditCardActionService) {
        super(_d, _a);

        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    }
       /* this._dictSrv.openedNode$.subscribe((node) => {
            this.node = node;
            if (this.node) {
                if (this.node.data) {
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        });
        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];*/

  /*      this._actSrv.action$.subscribe(
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
    }*/

    setTab(i: number) {
        this.currTab = i;
    }
/*
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
