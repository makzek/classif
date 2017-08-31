import { Component } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';

@Component({
    selector: 'eos-title',
    templateUrl: 'title.component.html'
})
export class TitleComponent {
    currentDesk: string;
    /* todo: define it or remove*/
    title: string;

    constructor( private _deskService: EosDeskService) {
        this._deskService.selectedDesk.subscribe(
            (link) => {
                if (link) {
                    this.currentDesk = '/home/' + link.id;
                } else {
                    this.currentDesk = '';
                }
            }
        );
    }
}
