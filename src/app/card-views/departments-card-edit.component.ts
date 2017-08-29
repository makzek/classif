import { Component, Output, Input, EventEmitter } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/action.service';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent {
    node: EosDictionaryNode;
    fieldGroups: FieldGroup[];
    currTab = 0;
    tmpObj: any = {};
    @Output() result: EventEmitter<any> = new EventEmitter<any>();
    editMode = false;

    constructor(private _dictionaryService: EosDictService, private _actonService: EditCardActionService) {
        this._dictionaryService.openedNode$.subscribe((node) => {
            this.node = node;
            if (this.node.data) {
                Object.assign(this.tmpObj, this.node.data);
            }
        });
        this._dictionaryService.dictionary$.subscribe((dict) => {
            this.fieldGroups = dict.descriptor.fieldGroups;
        });
        this._actonService.action$.subscribe(
            (act) => {
                if (act === 'save') {
                    this.editMode = false;
                    this.result.emit(this.tmpObj);
                }
                if (act === 'cancel') {
                    // console.log('node.data', this.node.data);
                    this.editMode = false;
                    this.result.emit(this.node.data);
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        );
    }

    setTab(i: number) {
        this.currTab = i;
    }

    changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this._actonService.emitMode('edit');
        } else {
            this._actonService.emitMode('view');
        }
    }
}
