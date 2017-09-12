import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot } from '@angular/router';

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

    _breadcrumbs$: BehaviorSubject<IBreadcrumb[]>;
    _currentLink$: BehaviorSubject<IDeskItem>;

    constructor(private _dictionaryService: EosDictService, private _deskService: EosDeskService) {
        this._breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);
        this._currentLink$ = new BehaviorSubject<IDeskItem>(null);


        this._deskService.selectedDesk.subscribe((desc) => {
            this._selectedDesk = desc;
            console.log('selected -->>', this._selectedDesk.id);
            // this.makeBreadCrumbs({});
        });

    }

    get breadcrumbs(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs$.asObservable();
    }

    get currentLink(): Observable<IDeskItem> {
        return this._currentLink$.asObservable();
    }

    makeBreadCrumbs(evt: any) {
        let currentUrlPart = evt.state._root;
        let currUrl = '';

        this._breadcrumbs = [ {
            url: '/home/' + this._selectedDesk.id,
            title: this._selectedDesk.name,
            params: new Object(),
        }];

        console.log('selected', this._selectedDesk.id);

        while (currentUrlPart.children.length > 0) {
            currentUrlPart = currentUrlPart.children[0];
            const routeSnaphot = currentUrlPart.value as ActivatedRouteSnapshot;
            const subpath = routeSnaphot.url.map((item) => item.path).join('/');
            console.log(subpath);

            if (subpath && subpath !== 'home' && routeSnaphot.data.showInBreadcrumb) {
                currUrl += '/' + subpath;
                const bc: IBreadcrumb = {
                    title: routeSnaphot.data.title,
                    url: currUrl,
                    params: routeSnaphot.params,
                };

                if (routeSnaphot.data) {
                    // console.log('data', routeSnaphot.data);
                    bc['data'] = {showSandwichInBreadcrumb: routeSnaphot.data.showSandwichInBreadcrumb};
                }

                if (routeSnaphot.params && routeSnaphot.data.showInBreadcrumb) {
                    if (routeSnaphot.params.dictionaryId && !routeSnaphot.params.nodeId) {
                        this._dictionaryService.getDictionariesList()
                            .then((list) => {
                                const _d = list.find((e: any) => e.id === routeSnaphot.params.dictionaryId);
                                if (_d) {
                                    bc.title = _d.title;
                                }
                            });
                    }
                    if (routeSnaphot.params.nodeId && subpath !== 'edit' && subpath !== 'view') {
                        this._dictionaryService.getNode(routeSnaphot.params.dictionaryId, routeSnaphot.params.nodeId)
                            .then((node) => {
                                bc.title = node.getShortQuickView()[0].value;
                            });
                    }

                    if (routeSnaphot.params.desktopId && routeSnaphot.data.showInBreadcrumb) {
                        this._deskService.desksList.subscribe(
                            (list) => {
                                const _d = list.find((e: any) => e.id === routeSnaphot.params.desktopId);
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

        this._breadcrumbs$.next(this._breadcrumbs);

        setTimeout(() => {
            let title = '';
            this._breadcrumbs.forEach(element => {
                title += element.title + '/';
            });
            title = title.slice(0, title.length - 1);
            this._currentLink = {
                link: evt.url,
                title: title,
                edited: false,
            }

            this._currentLink$.next(this._currentLink);
        }, 0);
    }

}
