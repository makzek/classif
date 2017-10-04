import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'eos-sandwich',
    templateUrl: 'sandwich.component.html',
})
export class SandwichComponent {
    @Input() isLeft: boolean;
    @Input() isWide: boolean;
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    isOpen = false;
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
            })
    }

    changeState() {
        this.isOpen = !this.isOpen;
        this.onClick.emit(this.isOpen);
    }
}
