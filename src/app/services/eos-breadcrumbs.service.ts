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
    private _currentLink: IDeskItem;

    private _breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService
    ) {
        this._breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
        _router.events.filter((e: NavigationEnd) => e instanceof NavigationEnd)
            .combineLatest(_deskSrv.selectedDesk)
            .subscribe((val: [NavigationEnd, EosDesk]) => {
                this.makeBreadCrumbs(val[1]);
            });
    }

    get breadcrumbs$(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs$.asObservable();
    }

    get breadcrumbs() {
        return this._breadcrumbs;
    }

    get currentLink() {
        return this._currentLink;
    }

    public makeBreadCrumbs(desk: EosDesk) {
        this._breadcrumbs = [{
            url: '/desk/' + desk.id,
            title: 'Главная',
            fullTitle: desk.name,
            params: null
        }];
        Promise.all(this._parseState(this._route.snapshot))
            .then((breadcrumbs) => {
                // 55: Убрать без title (!?) routing -> showInBreadcrubs
                this._breadcrumbs = this._breadcrumbs.concat(breadcrumbs.filter((bc) => bc && !!bc.title));
                this._fullTitleGen();
                this._currentLink = {
                    url: this._breadcrumbs[this._breadcrumbs.length - 1].url,
                    title: this._breadcrumbs[this._breadcrumbs.length - 1].title,
                    fullTitle: this._breadcrumbs[this._breadcrumbs.length - 1].fullTitle
                }
                this._breadcrumbs$.next(this._breadcrumbs);
            });
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
                    fullTitle: ''
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
                    }
                }
                crumbs.push(_crumbPromise);
            }
            _current = _current.firstChild;
        }
        return crumbs;
    }

    private _fullTitleGen() {
        const arr = [];
        for (const bc of this._breadcrumbs) {
            arr.push(bc.title + '/');
        }
        for (let i = 1; i < this._breadcrumbs.length; i++ ) {
            for (let j = 0; j <= i; j++) {
                this._breadcrumbs[i].fullTitle += arr[j];
            }
        }
        for (const bc of this._breadcrumbs) {
            bc.fullTitle = bc.fullTitle.substring(0, bc.fullTitle.length - 1);
        }
    }
}
