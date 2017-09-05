import { Component } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';

import { IDeskItem } from '../core/desk-item.interface';
import { ConfirmWindowService } from '../confirm-window/confirm-window.service';

@Component({
    selector: 'eos-desktop',
    templateUrl: 'desktop.component.html',
})
export class DesktopComponent {
    referencesList: IDeskItem[];
    recentItems: IDeskItem[];
    deskId: string;

    historyToLeft = false;

    constructor(
        private _dictionaryService: EosDictService,
        private _deskService: EosDeskService,
        private router: Router,
        private route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService
    ) {
        this.referencesList = [];
        this.router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this._dictionaryService.getDictionariesList());

        _deskService.selectedDesk.subscribe(
            (desk) => {
                if (desk) {
                    this._update(desk.references);
                    this.deskId = desk.id;
                }
            }
        );

        _deskService.recentItems.subscribe(
            (items) => this.recentItems = items
        );

        route.url.subscribe(
            (res) => {
                const link = res[0] || { path: 'system' };
                _deskService.setSelectedDesk(link.path);
            }
        );
    }

    _update(dictionariesList: IDeskItem[]) {
        this.referencesList = dictionariesList;
    }

    removeLink(link: IDeskItem): void {
        this._confirmSrv.confirm('Удалить?', 'Вы действительно хотите удалить рабочий стол ' + link.title + '?')
        .then((confirmed: boolean) => {
            if (confirmed) {
                this._deskService.unpinRef(link);
            }
        });
    }

    changeName(evt: Event, ref: IDeskItem) {
        this.stopDefault(evt);
        ref.edited = true;
    }

    save(evt: Event, ref: IDeskItem) {
        ref.edited = false;
    }

    stopDefault(evt: Event) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    setCursor(event) {
        /* set the cursor position at the end of textarea - special trick for IE and Edge */
        event.target.selectionStart = event.target.value.length;
    }
}
