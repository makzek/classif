import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
        _breadcrumbsSrv: EosBreadcrumbsService,
        _router: Router,
        _sandwichSrv: EosSandwichService,
        private _route: ActivatedRoute,
    ) {
        _breadcrumbsSrv.breadcrumbs$.subscribe((bc: IBreadcrumb[]) => this.breadcrumbs = bc);
        this.update();
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this.update());

        _sandwichSrv.currentDictState$.subscribe((state) => {
            this.infoOpened = state[1];
        });
    }

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.showPushpin = _actRoute.data.showPushpin;
    }
}
