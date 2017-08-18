import { Component, Input, ViewChild } from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'eos-info',
    templateUrl: 'info.component.html',
})
export class InfoComponent {
    @Input() info: string;
    @ViewChild('pop') private _tooltip: TooltipDirective;

    clicked = false;

    check() {
        if (!this.clicked) { this._tooltip.hide(); }
    }

    hide() {
        this.clicked = false;
        this._tooltip.hide();
    }
}
