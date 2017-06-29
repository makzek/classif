import { Component, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-eos',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    private _containerRef: ViewContainerRef;
    constructor(viewContainerRef: ViewContainerRef) {
        this._containerRef = viewContainerRef;
    }
}
