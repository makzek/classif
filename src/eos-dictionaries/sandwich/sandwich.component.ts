import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'eos-sandwich',
    templateUrl: 'sandwich.component.html',
})
export class SandwichComponent implements OnChanges {
    @Input() isLeft: boolean;
    @Input() isWide: boolean;
    @Input() close: boolean;
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    isOpen = false;
    show = false;
    width = '0px';

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
    }

    ngOnChanges() {
        if (this.isWide) {
            this.width = '400px';
        } else {
            this.width = '0px';
        }
        if (this.close) {
            this.isOpen = false;
        }
    }

    changeState() {
        this.isOpen = !this.isOpen;
        this.onClick.emit(this.isOpen);
    }
}
