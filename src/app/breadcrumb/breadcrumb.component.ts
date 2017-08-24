import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})
export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];

    constructor(private _router: Router, private _breadcrumbsService: EosBreadcrumbsService) {
            _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => {
                this._breadcrumbsService.makeBreadCrumbs(e);
            });

            this._breadcrumbsService.breadcrumbs.subscribe((bc) => {
                if (bc) {
                    this.breadcrumbs = bc;
                }
            });
}
}
