import { Component, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
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
    breadcrumbView = true;
    firstLoadAuth = false;

    constructor(
        viewContainerRef: ViewContainerRef,
        private _profileSrv: EosUserProfileService,
        private _router: Router,
        private _route: ActivatedRoute,
    ) {
        this._containerRef = viewContainerRef;
        this._profileSrv.authorized$.subscribe((auth) => {
            this.isAuthorized = auth;
            if (auth !== null) {
                this.firstLoadAuth = true;
            }
        });
        if (!environment.production) {
            this.version = environment.version;
        }
        _router.events.filter((evt: NavigationEnd) => evt instanceof NavigationEnd)
        .subscribe((evt: NavigationEnd) => {
            let _actRoute = _route.snapshot;
            while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
            this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        });
    }
}
