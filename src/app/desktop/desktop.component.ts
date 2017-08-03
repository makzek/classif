import { Component } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';

@Component({
    selector: 'eos-desktop',
    templateUrl: 'desktop.component.html',
})
export class DesktopComponent {
    dictionariesList: Array<{ link: string, title: string }>;
    lastEditItems: Array<{ link: string, title: string }>;

    constructor(private _dictionaryService: EosDictService, private _deskService: EosDeskService, _router: Router , private router: Router,
        private route: ActivatedRoute) {
        this.dictionariesList = [];
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this._dictionaryService.getDictionariesList());

        

        _deskService.selectedDesk.subscribe(
            (desk) => {
                this._update(desk.references);
            }
        );

        _deskService.lastEditItems.subscribe(
            (items) => this.lastEditItems = items
        );

        route.url.subscribe(
            (res) => _deskService.setSelectedDesk(res[0].path)
        );
    }

    _update(dictionariesList: Array<{ link: string, title: string }>) {
        this.dictionariesList = dictionariesList;
    }

    removeLink(link: { link: string, title: string }) {
        this._deskService.unpinRef(0, link);
    }
}