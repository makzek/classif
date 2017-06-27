import { Component } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/filter';

interface IBreadcrumb {
    url: string;
    title: string;
    params: any;
};
@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})
export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];

    constructor(private _router: Router) {
        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => this._update(e));
    }

    private _update(evt: any) {
        let currentUrlPart = evt.state._root;
        let currUrl = '';

        this.breadcrumbs = [];
        while (currentUrlPart.children.length > 0) {
            currentUrlPart = currentUrlPart.children[0];
            let routeSnaphot = <ActivatedRouteSnapshot>currentUrlPart.value;

            currUrl += '/' + routeSnaphot.url.map((item) => item.path).join('/');

            this.breadcrumbs.push({
                title: (<any>routeSnaphot.data).title,
                url: currUrl,
                params: routeSnaphot.params,
            });
        }
    }
}
