import { Component } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../services/eos-desk.service';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent {
    deskList: EosDesk[];
    selectedDesk: EosDesk = {
        id: '100',
        name: 'Selected Desk',
        references: [],
        lastEditList: [],
    };
    constructor(private eosDeskService: EosDeskService) {
        this.eosDeskService.desksList.subscribe(
            (res) => {
                this.deskList = res;
            }, (err) => alert('err' + err)
        );

    }
}
