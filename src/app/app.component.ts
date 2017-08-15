import { Component, ViewContainerRef, NgZone } from '@angular/core';

import { EosDeskService } from '../app/services/eos-desk.service';

@Component({
    selector: 'eos-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    private _containerRef: ViewContainerRef;

    currentDesk: string;
    constructor(
        viewContainerRef: ViewContainerRef,
        private _deskService: EosDeskService,
        private _zone: NgZone
    ) {
        this._containerRef = viewContainerRef;

        _zone.onError.subscribe((err) => {
            console.error(err)
        });

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
