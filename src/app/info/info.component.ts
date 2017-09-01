import { Component, Input, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'eos-info',
    templateUrl: 'info.component.html',
})
export class InfoComponent {
    @Input() info: string;
    @ViewChild('pop') private _tooltip: TooltipDirective;

    private _pinned = false;
    private _innerClick: boolean;

    @HostListener('window:click', [])
    clickout() {
        if (this._tooltip && !this._innerClick) {
            this._tooltip.hide();
        }
        this._innerClick = false;
    }

    check() {
        if (this._tooltip && !this._pinned) {
            this._tooltip.hide();
        }
    }

    hide() {
        this._pinned = false;
        if (this._tooltip) {
            this._tooltip.hide();
        }
    }

    reverse() {
        this._innerClick = true;
        this._pinned = !this._pinned;
        this.check();
    }
}
