import { Component, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'eos-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    private _containerRef: ViewContainerRef;
    constructor(viewContainerRef: ViewContainerRef) {
        this._containerRef = viewContainerRef;
    }
}
