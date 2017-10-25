import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosDesk } from '../core/eos-desk';

@Injectable()
export class EosBreadcrumbsService {
    private _breadcrumbs: IBreadcrumb[];
    _currentLink: IDeskItem;

    _breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;
    _currentLink$: BehaviorSubject<IDeskItem>;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService
    ) {
        this._breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
        this._currentLink$ = new BehaviorSubject<IDeskItem>(null);

        _router.events
            .filter((e) => e instanceof NavigationEnd)
            .combineLatest(_deskSrv.selectedDesk)
            .subscribe((val: [NavigationEnd, EosDesk]) => {
                this.makeBreadCrumbs(val[1]);
            });
    }

    get breadcrumbs(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs$.asObservable();
    }

    get currentLink(): Observable<IDeskItem> {
        return this._currentLink$.asObservable();
    }

    makeBreadCrumbs(desk: EosDesk) {
        if (desk) {
            this._breadcrumbs = [{
                url: '/desk/' + desk.id,
                title: 'Главная', // desk.name,
                params: null,
                fullTitle: desk.name
            }];

            Promise.all(this._parseState(this._route.snapshot))
                .then((breadcrumbs) => {
                    this._breadcrumbs = this._breadcrumbs.concat(breadcrumbs.filter((bc) => bc && !!bc.title));

                    let title = '';
                    this._breadcrumbs.forEach(element => {
                        title += element.title + '/';
                    });
                    title = title.slice(0, title.length - 1);

                    this._currentLink = {
                        url: this._breadcrumbs[this._breadcrumbs.length - 1].url,
                        title: title,
                        fullTitle: ''
                    }

                    this._breadcrumbs$.next(this._breadcrumbs);
                    this._currentLink$.next(this._currentLink);
                });
        }
    }

    private _parseState(route: ActivatedRouteSnapshot): Promise<IBreadcrumb>[] {
        let currUrl = '';
        let _current = route;

        const crumbs: Promise<IBreadcrumb>[] = [];

        while (_current) {
            const subpath = _current.url.map((item) => item.path).join('/');

            if (subpath && _current.data && _current.data.showInBreadcrumb) {
                currUrl += '/' + subpath;

                const bc: IBreadcrumb = {
                    title: _current.data.title,
                    url: currUrl,
                    params: _current.params,
                    fullTitle: _current.data.title
                };

                let _crumbPromise: Promise<IBreadcrumb> = Promise.resolve(bc);

                if (_current.params) {
                    if (_current.params.dictionaryId && !_current.params.nodeId) {
                        const _dictId = _current.params.dictionaryId;
                        _crumbPromise = this._dictSrv.getDictionariesList()
                            .then((list) => {
                                const _d = list.find((e: any) => e.id === _dictId);
                                if (_d) {
                                    bc.title = _d.title;
                                }
                                return bc;
                            });
                    } else if (_current.params.nodeId && subpath !== 'edit' && subpath !== 'view') {
                        const _dictId = _current.params.dictionaryId;
                        const _nodeId = _current.params.nodeId
                        _crumbPromise = this._dictSrv.getNode(_dictId, _nodeId)
                            .then((node) => {
                                if (node) {
                                    if (this._dictSrv.isRoot(node.id)) { // remove root node from bc
                                        bc.title = null;
                                    } else {
                                        const _titleView = node.getShortQuickView()[0];
                                        if (_titleView) {
                                            bc.title = _titleView.value;
                                        }
                                    }
                                }
                                return bc;
                            });
                    } /* else if (_current.params.desktopId && _current.data.showInBreadcrumb) { // is it still need ????
                        const _deskId = _current.params.desktopId;
                        _crumbPromise = this._deskSrv.desksList.toPromise()
                            .then((list) => {
                                console.warn('get desk');
                                const _d = list.find((e: any) => e.id === _deskId);
                                if (_d) {
                                    bc.title = _d.name;
                                }
                                return bc;
                            });
                    } */
                }

                crumbs.push(_crumbPromise);
            }
            _current = _current.firstChild;
        }
        return crumbs;
    }

    public getBreadcrumbs() {
        return this._breadcrumbs;
    }
}
