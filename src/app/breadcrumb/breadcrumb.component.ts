import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';
import { Subject } from 'rxjs/Subject';
import { RECORD_ACTIONS_EDIT,
    RECORD_ACTIONS_NAVIGATION_UP,
    RECORD_ACTIONS_NAVIGATION_DOWN } from '../../eos-dictionaries/consts/record-actions.consts';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})

export class BreadcrumbsComponent implements OnDestroy {
    breadcrumbs: IBreadcrumb[];
    infoOpened: boolean;
    isDictionaryPage = false;

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;

    haveInfoData = false;
    showPushpin = false;
    showInfoAct = false;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _router: Router,
        private _sandwichSrv: EosSandwichService,
        private _route: ActivatedRoute,
        private _dictSrv: EosDictService
    ) {
        _breadcrumbsSrv.breadcrumbs$.takeUntil(this.ngUnsubscribe).
            subscribe((bc: IBreadcrumb[]) => this.breadcrumbs = bc);
        this.update();
        this._router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => this.update());

        this._sandwichSrv.currentDictState$.takeUntil(this.ngUnsubscribe)
            .subscribe((state) => {
                this.infoOpened = state[1];
            });

        this._dictSrv.openedNode$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((n) => n ? this.haveInfoData = true : this.haveInfoData = false);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    actionHandler(action) {
        this._breadcrumbsSrv.sendAction({action: action});
    }

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.showPushpin = _actRoute.data.showPushpin;
        this.showInfoAct = _actRoute.data && _actRoute.data.showSandwichInBreadcrumb;
    }
}
