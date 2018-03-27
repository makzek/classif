import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})

export class BreadcrumbsComponent implements OnDestroy {
    breadcrumbs: IBreadcrumb[];
    infoOpened: boolean;
    isDictionaryPage = false;

    showPushpin = false;

    private ngUnsubscribe: Subject<any> = new Subject();

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
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => this.update());

        _sandwichSrv.currentDictState$.subscribe((state) => {
            this.infoOpened = state[1];
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.showPushpin = _actRoute.data.showPushpin;
    }
}
