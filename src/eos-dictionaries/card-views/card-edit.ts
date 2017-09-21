import { Output, Input, EventEmitter, OnChanges } from '@angular/core';

import { EosDictionary } from '../core/eos-dictionary';
import { EosDictService } from '../services/eos-dict.service';
import { EditCardActionService, EDIT_CARD_ACTIONS, EDIT_CARD_MODES } from '../edit-card/edit-card-action.service';

export class CardEdit implements OnChanges {
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

    constructor(private _dictSrv: EosDictService, private _actSrv: EditCardActionService) {
        this._dictSrv.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
            // console.log('edit set', _d.descriptor.getFieldSet(E_FIELD_SET.edit, {}));
        });
        this._actSrv.action$.subscribe((act) => {
            switch (act) {
                case EDIT_CARD_ACTIONS.save:
                    this.editMode = false;
                    this.result.emit(this.tmpObj);
                    break;
                case EDIT_CARD_ACTIONS.cancel:
                    this.editMode = false;
                    this.result.emit(this.data);
                    Object.assign(this.tmpObj, this.data);
                    break;
                case EDIT_CARD_ACTIONS.create:
                    this.result.emit(this.tmpObj);
                    break;
                case EDIT_CARD_ACTIONS.makeEmptyObject:
                    this.editMode = true;
                    // console.log('newNode', this._dictionaryService.getEmptyNode());
                    this.tmpObj = {};
                    break;
            }
        }
        );

        this._actSrv.mode$.subscribe((mode) => {
            switch (mode) {
                case EDIT_CARD_MODES.edit:
                    this.editMode = true;
                    break;
                case EDIT_CARD_MODES.view:
                    this.editMode = false;
                    break;
                }
            });
    }

    ngOnChanges() {
        if (this.dictionaryId.length && this.nodeId.length) {
            this._dictSrv.openNode(this.dictionaryId, this.nodeId).then((node) => {
                // console.log('node.getEditView()', node.getEditView());
                node.getEditView().forEach(fld => {
                    this.data[fld.key] = fld.value;
                });
                Object.assign(this.tmpObj, this.data);
            }).catch();
        } else {
            this.dictionary.descriptor.record.getEditView({}).forEach((fld) => {
                this.data[fld.key] = fld.value;
            });
        }
    }

    setUnsavedChanges() {
        this._actSrv.emitMode(EDIT_CARD_MODES.unsavedChanges);
    }
}
