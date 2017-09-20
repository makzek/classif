import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';

@Component({
    selector: 'eos-sandwich',
    templateUrl: 'sandwich.component.html',
})
export class SandwichComponent {
    // @Input() isRotated: boolean;
    isRotated = false;
    show = false;

    @Input() isLeft: boolean;
    @Input() isWide: boolean;
    @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _bcSrv: EosBreadcrumbsService) {
        _bcSrv.breadcrumbs.subscribe((_bc) => {
            /* tslint:disable:no-bitwise */
            this.show = !!~_bc.findIndex((_bcItem) => _bcItem.params.dictionaryId) &&
                !~_bc.findIndex((_bcItem) => _bcItem.params.edit || _bcItem.params.view );
            /* tslint:enable:no-bitwise */
        });
    }

    changeState() {
        this.isRotated = !this.isRotated;
        this.onClick.emit(this.isRotated);
    }
}
