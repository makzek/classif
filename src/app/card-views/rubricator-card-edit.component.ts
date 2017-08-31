import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/action.service';
import { E_FIELD_SET } from '../core/dictionary-descriptor';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent implements OnChanges {
    // node: EosDictionaryNode;
    tmpObj: any = {};
    data: any = {};
    editMode = true;
    showOwners = true;
    showUsers = true;
    showAccess = true;

    dictionary: EosDictionary;

    @Input() nodeId: string;
    @Input() dictionaryId: string;
    @Output() result: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _dictionaryService: EosDictService, private _actonService: EditCardActionService) {
        /*this._dictionaryService.openedNode$.subscribe((node) => {
            this.node = node;
            if (this.node) {
                if (this.node.data) {
                    Object.assign(this.tmpObj, this.node.data);
                }
            }
        });*/

        this._dictionaryService.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
        });
        this._actonService.action$.subscribe(
            (act) => {
                if (act === 'save') {
                    this.editMode = false;
                    this.result.emit(this.tmpObj);
                }
                if (act === 'cancel') {
                    this.editMode = false;
                    this.result.emit(this.data);
                    Object.assign(this.tmpObj, this.data);
                }

                if (act === 'create') {
                    this.result.emit(this.tmpObj);
                }
            }
        );

        this._actonService.mode$.subscribe((mode) => {
            if (mode === 'edit') {
                this.editMode = true;
            }
            if (mode === 'view') {
                this.editMode = false;
            }
        });
    }

    ngOnChanges() {
        if (this.dictionaryId.length && this.nodeId.length) {
            this._dictionaryService.openNode(this.dictionaryId, this.nodeId).then((node) => {
                node.getEditView().forEach(fld => {
                    this.data[fld.key] = fld.value;
                });
                Object.assign(this.tmpObj, this.data);
            }).catch();
        } else {
            /* this.dictionary.descriptor.getFieldSet(E_FIELD_SET.edit).forEach((field) => {
                this.data[field.key] = null;
                Object.assign(this.tmpObj, this.data);
            });*/

            this.dictionary.descriptor.record.getEditView({}).forEach((fld) => {
                this.data[fld.key] = fld.value;
            });
        }
    }

    /* changeEditMode(value: boolean) {
        this.editMode = value;
        if (value) {
            this._actonService.emitMode('edit');
        } else {
            this._actonService.emitMode('view');
        }
    }*/

    setUnsavedChanges() {
        this._actonService.emitMode('unsavedChanges');
    }
}
