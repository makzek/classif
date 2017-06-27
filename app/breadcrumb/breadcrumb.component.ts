import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';

interface IBreadcrumb {
    url: string;
    title: string;
    params?: any;
}

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
        console.log('Breadcrumbs', evt);

        this.breadcrumbs = [{
            url: '/home',
            title: 'Home',
            params: new Object(),
        }];
        while (currentUrlPart.children.length > 0) {
            currentUrlPart = currentUrlPart.children[0];
            const routeSnaphot = currentUrlPart.value as ActivatedRouteSnapshot;
            const subpath = routeSnaphot.url.map((item) => item.path).join('/');

            if (subpath) {
                currUrl += '/' + subpath;
                this.breadcrumbs.push({
                    title: (routeSnaphot.data).title,
                    url: currUrl,
                    params: routeSnaphot.params,
                });
            }
        }
    }
}
