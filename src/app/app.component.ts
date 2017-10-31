import { Component, ViewContainerRef } from '@angular/core';

import { environment } from '../environments/environment';
import { APP_MODULES, APP_MODULES_DROPDOWN } from './consts/app-modules.const';
import { EosUserProfileService } from './services/eos-user-profile.service';

@Component({
    selector: 'eos-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    private _containerRef: ViewContainerRef;

    modules = APP_MODULES;
    modulesDropdown = APP_MODULES_DROPDOWN;
    version: string;
    isAuthorized: boolean;

    constructor(
        viewContainerRef: ViewContainerRef,
        private _profileSrv: EosUserProfileService
    ) {
        this._containerRef = viewContainerRef;
        this._profileSrv.authorized$.subscribe((auth) => this.isAuthorized = auth);
        if (!environment.production) {
            this.version = environment.version;
        }
    }
}
