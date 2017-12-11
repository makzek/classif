import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})

export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];
    infoOpened: boolean;
    isDictionaryPage = false;

    showPushpin = false;

    constructor(
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _sandwichSrv: EosSandwichService,

    ) {
        this._breadcrumbsSrv.breadcrumbs$.subscribe((bc: IBreadcrumb[]) => this.breadcrumbs = bc);

        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe((evt) => {
                let _actRoute = _route.snapshot;
                while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }

                this.showPushpin = _actRoute.data.showPushpin;
            });
        this._sandwichSrv.currentDictState$.subscribe((state) => {
            this.infoOpened = state[1];
        });
    }
}
