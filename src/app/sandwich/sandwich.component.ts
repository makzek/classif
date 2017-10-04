import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CardComponent } from '../../eos-dictionaries/card/card.component'

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
                this.show = _actRoute.params && _actRoute.params.dictionaryId && _actRoute.component !== CardComponent;
            })
    }

    changeState() {
        this.isOpen = !this.isOpen;
        this.onClick.emit(this.isOpen);
    }
}
