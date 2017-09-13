import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';

import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosDesk } from '../core/eos-desk';

@Injectable()
export class EosBreadcrumbsService {
    _breadcrumbs: IBreadcrumb[];
    _currentLink: IDeskItem;

    private _selectedDesk: EosDesk;
    private _routes: RoutesRecognized;

    _breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;
    _currentLink$: BehaviorSubject<IDeskItem>;

    constructor(
        private _router: Router,
        private _dictionaryService: EosDictService,
        private _deskService: EosDeskService
    ) {
        this._breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
        this._currentLink$ = new BehaviorSubject<IDeskItem>(null);

        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e: RoutesRecognized) => {
                this._routes = e;
                this.makeBreadCrumbs();
            });

        _deskService.selectedDesk.subscribe((desc) => {
            this._selectedDesk = desc;
            this.makeBreadCrumbs();
            /* console.log('selected -->>', this._selectedDesk.id); */
            // this.makeBreadCrumbs({});
        });

    }

    get breadcrumbs(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs$.asObservable();
    }

    get currentLink(): Observable<IDeskItem> {
        return this._currentLink$.asObservable();
    }

    makeBreadCrumbs() {
        if (this._selectedDesk && this._routes) {
            this._breadcrumbs = [{
                url: '/desk/' + this._selectedDesk.id,
                title: this._selectedDesk.name,
                params: new Object(),
            }];

            this._parseState(this._routes.state.root);

            this._breadcrumbs$.next(this._breadcrumbs);

            setTimeout(() => {
                let title = '';
                this._breadcrumbs.forEach(element => {
                    title += element.title + '/';
                });
                title = title.slice(0, title.length - 1);
                this._currentLink = {
                    link: this._routes.state.url,
                    title: title,
                    edited: false,
                }

                this._currentLink$.next(this._currentLink);
            }, 0);
        }
    }

    private _parseState(route: ActivatedRouteSnapshot) {
        let currUrl = '';

        while (route.firstChild) {
            route = route.firstChild;
            /* const routeSnaphot = route.value as ActivatedRouteSnapshot; */
            const subpath = route.url.map((item) => item.path).join('/');

            /* console.log(subpath); */

            if (subpath && subpath !== 'desk' && route.data.showInBreadcrumb) {
                currUrl += '/' + subpath;
                const bc: IBreadcrumb = {
                    title: route.data.title,
                    url: currUrl,
                    params: route.params,
                };

                if (route.data) {
                    // console.log('data', routeSnaphot.data);
                    bc['data'] = { showSandwichInBreadcrumb: route.data.showSandwichInBreadcrumb };
                }

                if (route.params && route.data.showInBreadcrumb) {
                    if (route.params.dictionaryId && !route.params.nodeId) {
                        this._dictionaryService.getDictionariesList()
                            .then((list) => {
                                const _d = list.find((e: any) => e.id === route.params.dictionaryId);
                                if (_d) {
                                    bc.title = _d.title;
                                }
                            });
                    }
                    if (route.params.nodeId && subpath !== 'edit' && subpath !== 'view') {
                        this._dictionaryService.getNode(route.params.dictionaryId, route.params.nodeId)
                            .then((node) => {
                                bc.title = node.getShortQuickView()[0].value;
                            });
                    }

                    if (route.params.desktopId && route.data.showInBreadcrumb) {
                        this._deskService.desksList.toPromise().then(
                            (list) => {
                                const _d = list.find((e: any) => e.id === route.params.desktopId);
                                if (_d) {
                                    bc.title = _d.name;
                                }
                            }
                        );
                    }
                }

                if (bc) {
                    this._breadcrumbs.push(bc);
                }
            }
        }
    }
}
