import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { CardActionService } from '../card/card-action.service';
import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-rooms-card-edit',
    templateUrl: 'rooms-card-edit.component.html',
})
export class RoomsCardEditComponent extends CardEditComponent {
    constructor(private _d: EosDictService, private _a: CardActionService) {
        super(_d, _a);
    }
}
