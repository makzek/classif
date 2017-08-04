import { Component, ViewContainerRef } from '@angular/core';

import { EosDeskService } from '../app/services/eos-desk.service';

@Component({
    selector: 'eos-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    private _containerRef: ViewContainerRef;

    currentDesk: string;
    constructor(viewContainerRef: ViewContainerRef, private _deskService: EosDeskService) {
        this._containerRef = viewContainerRef;

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
