import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldGroup } from '../core/field-descriptor';

@Component({
    selector: 'eos-departments-card-view',
    templateUrl: 'departments-card-view.component.html',
})
export class DepartmentsCardViewComponent {
    node: EosDictionaryNode;
    fieldGroups: FieldGroup[];
    currTab = 0;

    constructor(private _dictionaryService: EosDictService) {
        this._dictionaryService.openedNode$.subscribe((node) => {
            this.node = node;
            console.log(this.node);
        });
        this._dictionaryService.dictionary$.subscribe((dict) => {
            this.fieldGroups = dict.descriptor.fieldGroups;
        });
    }
}
