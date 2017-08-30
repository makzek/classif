import { Component, Input, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'eos-info',
    templateUrl: 'info.component.html',
})
export class InfoComponent {
    @Input() info: string;
    @ViewChild('pop') private _tooltip: TooltipDirective;

    clicked = false;

    @HostListener('window:click', ['$event'])
    clickout = (event) => {
        const x = event.target.parentElement.parentElement.parentElement;

        if (x.tagName !== 'EOS-INFO') {
            this._tooltip.hide();
        }
    }

    check() {
        if (!this.clicked) { this._tooltip.hide(); }
    }

    hide() {
        this.clicked = false;
        this._tooltip.hide();
    }

    reverse() {
        this.clicked = !this.clicked;
        this.check();
    }
}
