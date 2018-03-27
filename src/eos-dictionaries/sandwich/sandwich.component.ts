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

    get hideTree() {
        return this._sandwichSrv.treeIsBlocked;
    }

    constructor(
        _router: Router,
        private _sandwichSrv: EosSandwichService,
        private _route: ActivatedRoute,
    ) {
        this.update();
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this.update());

        this._sandwichSrv.currentDictState$.subscribe((state) => {
            if (this.isLeft) {
                this.isWide = state[0];
            } else {
                this.isWide = state[1];
            }
        });
    }

    changeState() {
        this._sandwichSrv.changeDictState(!this.isWide, this.isLeft);
    }

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.show = _actRoute.data && _actRoute.data.showSandwichInBreadcrumb;
    }
}
