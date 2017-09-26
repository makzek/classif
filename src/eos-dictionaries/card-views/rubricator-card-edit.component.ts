import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { CardActionService } from '../card/card-action.service';
import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends CardEditComponent {
    // node: EosDictionaryNode;
    /*newData: any = {};
    data: any = {};
    editMode = true;
    showOwners = true;
    showUsers = true;
    showAccess = true;

    dictionary: EosDictionary;

    @Input() nodeId: string;
    @Input() dictionaryId: string;
    @Output() result: EventEmitter<any> = new EventEmitter<any>();*/

    constructor(private _d: EosDictService, private _e: CardActionService) {
        super(_d,  _e);
    }
}
