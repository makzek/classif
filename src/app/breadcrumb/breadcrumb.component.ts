import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';

import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk} from '../core/eos-desk';

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
    private _dictionaryBc: IBreadcrumb;
    private _nodeBc: IBreadcrumb;
    dictionariesList: Array<{ id: string, title: string }>;
    deskList: EosDesk[];
    currentLink: string;

    constructor(private _router: Router, private _dictionaryService: EosDictService, private _deskService: EosDeskService) {
        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => this._update(e));
        _dictionaryService.dictionariesList$
            .subscribe((dictionariesList) => this.dictionariesList = dictionariesList);
        this.dictionariesList = [];
        this._deskService.desksList.subscribe((res) => {
            this.deskList = res.filter((d) => d.id !== 'system');
        });
    }

    private _update(evt: any) {
        this.currentLink = evt.url;
        let currentUrlPart = evt.state._root;
        let currUrl = '';

        this.breadcrumbs = [{
            url: '/home',
            title: 'Home',
            params: new Object(),
        }];

        while (currentUrlPart.children.length > 0) {
            currentUrlPart = currentUrlPart.children[0];
            const routeSnaphot = currentUrlPart.value as ActivatedRouteSnapshot;
            const subpath = routeSnaphot.url.map((item) => item.path).join('/');

            if (subpath && subpath !== 'home' && routeSnaphot.data.showInBreadcrumb) {
                currUrl += '/' + subpath;
                const bc: IBreadcrumb = {
                    title: routeSnaphot.data.title,
                    url: currUrl,
                    params: routeSnaphot.params,
                };

                /*
                if (routeSnaphot.params && routeSnaphot.data.showInBreadcrumb) {
                     if (routeSnaphot.params.dictionaryId) {
                         this._dictionaryBc = bc;

                         this._dictionaryService.getDictionariesList()
                             .then((list) => {
                                 const _d = list.find((e: any) => e.id === routeSnaphot.params.dictionaryId);
                                 if (_d) {
                                     this._dictionaryBc.title = _d.title;
                                 }
                             });
                     }
                }
                */

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
                    if (routeSnaphot.params.nodeId && subpath !== 'edit') {
                        this._dictionaryService.getNode(routeSnaphot.params.dictionaryId, routeSnaphot.params.nodeId)
                            .then((node) => {
                                bc.title = node.title;
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
                    this.breadcrumbs.push(bc);
                }
            }
        }
    }

    pin(desk: EosDesk) {
        let title = '';
        this.breadcrumbs.forEach(element => {
            title += element.title + '/';
        });
        title = title.slice(0, title.length - 1);
        
        desk.references.push({
            link: this.currentLink,
            title: title,
        })
        this._deskService.editDesk(desk);
    }
}
