import { Component, Output, Input, EventEmitter } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/action.service';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent {
    node: EosDictionaryNode;
    tmpObj: any = {};
    @Output() result: EventEmitter<any> = new EventEmitter<any>();
    editMode = true;
    showOwners = true;
    showUsers = true;
    showAccess = true;

    constructor(private _dictionaryService: EosDictService, private _actonService: EditCardActionService) {
        this._dictionaryService.openedNode$.subscribe((node) => {
            this.node = node;
            if (this.node) {
                if (this.node.data) {
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        });
        this._actonService.action$.subscribe(
            (act) => {
                if (act === 'save') {
                    this.editMode = false;
                    this.result.emit(this.tmpObj);
                }
                if (act === 'cancel') {
                    this.editMode = false;
                    this.result.emit(this.node.data);
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        );
    }

    changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this._actonService.emitMode('edit');
        } else {
            this._actonService.emitMode('view');
        }
    }

    setUnsavedChanges() {
        this._actonService.emitMode('unsavedChanges');
    }
}
