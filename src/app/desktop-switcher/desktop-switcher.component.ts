import { Component } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../services/eos-desk.service';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent {
    deskList: EosDesk[];
    selectedDesk: EosDesk;
    constructor(private eosDeskService: EosDeskService) {
        this.eosDeskService.desksList.subscribe(
            (res) => {
                this.deskList = res;
            }, (err) => alert('err' + err)
        );

        this.eosDeskService.selectedDesk.subscribe(
            (res) => {
                this.selectedDesk = res;
            }, (err) => alert('err' + err)
        );
    }

    selectDesk(desk: EosDesk): void {
        this.eosDeskService.setSelectedDesk(desk);
    }
}
