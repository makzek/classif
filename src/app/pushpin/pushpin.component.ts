import { Component } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IDeskItem } from '../core/desk-item.interface';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
})
export class PushpinComponent {
    deskList: EosDesk[];
    _link: IDeskItem;

    constructor(private _deskService: EosDeskService, private _breadcrumbsService: EosBreadcrumbsService) {
        this._deskService.desksList.subscribe((res) => {
            this.deskList = res.filter((d) => d.id !== 'system');
        });
        this._breadcrumbsService.currentLink.subscribe((link) => {
            if (link) {
                this._link = link;
                this._deskService.addRecentItem(this._link);
            }
        });
    }

    pin(desk: EosDesk) {
        desk.references.push(this._link);
        this._deskService.editDesk(desk);
    }

}
