import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'eos-sandwich',
    templateUrl: 'sandwich.component.html',
})
export class SandwichComponent {
    @Input() isLeft: boolean;
    @Input() isWide: boolean;
    @Input() close: boolean;
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    show = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe((evt) => {
                let _actRoute = _route.snapshot;
                while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
                this.show = _actRoute.data && _actRoute.data.showSandwichInBreadcrumb;
            });
            console.log(this)
    }

    changeState() {
        this.onClick.emit(!this.isWide);
    }
}
