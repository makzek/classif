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
        _route: ActivatedRoute,
        _sandwichSrv: EosSandwichService,

    ) {
        _breadcrumbsSrv.breadcrumbs$.subscribe((bc: IBreadcrumb[]) => this.breadcrumbs = bc);

        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => {
                let _actRoute = _route.snapshot;
                while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }

                this.showPushpin = _actRoute.data.showPushpin;
            });
        _sandwichSrv.currentDictState$.subscribe((state) => {
            this.infoOpened = state[1];
        });
    }
}
