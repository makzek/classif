import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldGroup } from '../core/field-descriptor';
import { EditCardActionService } from '../edit-card/action.service';

@Component({
    selector: 'eos-departments-card-view',
    templateUrl: 'departments-card-view.component.html',
})
export class DepartmentsCardViewComponent {
    node: EosDictionaryNode;
    fieldGroups: FieldGroup[];
    currTab = 0;

    constructor(private _dictionaryService: EosDictService, private _actonService: EditCardActionService) {
        this._dictionaryService.openedNode$.subscribe((node) => {
            this.node = node;
            console.log(this.node);
        });
        this._dictionaryService.dictionary$.subscribe((dict) => {
            this.fieldGroups = dict.descriptor.fieldGroups;
        });

        this.currTab = this._actonService.currTab;
    }

    setTab(i: number) {
        this.currTab = i;
        this._actonService.currTab = this.currTab;
    }
}
