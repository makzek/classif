import { Component, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent {
    selectedDesk: EosDesk;
    innerClick: boolean;

    @ViewChild('dropDown') private _dropDown: BsDropdownDirective;

    constructor(private _deskSrv: EosDeskService,
        private _router: Router,
        activeRoute: ActivatedRoute
    ) {
        this._deskSrv.selectedDesk.subscribe((res) => this.selectedDesk = res);
    }

    @HostListener('window:click', [])
    clickout() {
        if (!this.innerClick) {
            this._dropDown.toggle(false);
        }
        this.innerClick = false;
    }

    setInnerClick() {
        this.innerClick = true;
    }

    openDesk(desk: EosDesk): void {
        this._router.navigate(['/desk', desk.id]);
        this._dropDown.toggle(false);
    }
}
