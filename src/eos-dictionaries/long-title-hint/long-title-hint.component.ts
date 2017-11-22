import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-longtitle-hint',
    templateUrl: 'long-title-hint.component.html'
})

export class LongTitleHintComponent {
    @Input() title: string;
    @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter();
    public top: string;
    public left: string;
    public opacity = 0;

    public show = false;
    constructor() {
    }

    public showHint(top: number, left: number) {
        this.show = true;
        this.top = top + 'px';
        this.left = left + 'px';
        this.opacity = 1;
    }

    public hideHint() {
        this.opacity = 0;
        setTimeout(() => this.show = false, 200);
    }

    public select() {
        this.onSelect.emit();
    }

}
