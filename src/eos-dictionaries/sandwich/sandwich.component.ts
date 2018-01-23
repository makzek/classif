import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { EosSandwichService } from '../services/eos-sandwich.service';

@Component({
    selector: 'eos-sandwich',
    templateUrl: 'sandwich.component.html',
})
export class SandwichComponent {
    @Input() isLeft: boolean;
    isWide: boolean;

    show = false;

    constructor(
        _route: ActivatedRoute,
        _router: Router,
        private _sandwichSrv: EosSandwichService,
    ) {
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => {
                let _actRoute = _route.snapshot;
                while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
                this.show = _actRoute.data && _actRoute.data.showSandwichInBreadcrumb;
            });

        this._sandwichSrv.currentDictState$.subscribe((state) => {
            if (this.isLeft) {
                this.isWide = state[0];
            } else {
                this.isWide = state[1];
            }
        });
    }

    get hideTree() {
        return this._sandwichSrv.treeIsBlocked;
    }

    changeState() {
        this._sandwichSrv.changeDictState(!this.isWide, this.isLeft);
    }
}
