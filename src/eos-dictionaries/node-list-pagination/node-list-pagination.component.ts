import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IListPage {
    start: number;
    current: number;
    length: number;
};

interface IPageLength {
    title: string;
    value: number;
}

const PAGES: IPageLength[] = [{
    title: '10',
    value: 10
}, {
    title: '20',
    value: 20
}, {
    title: '30',
    value: 30
}];

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent {
    @Input() position: any;
    @Input() total: number;
    @Output() change: EventEmitter<IListPage> = new EventEmitter<IListPage>();

    readonly pages = PAGES;
    page: IListPage;
    pageLength: IPageLength;

    private _dropStartPage = true;

    constructor() {
        this.pageLength = this.pages[0];
        this.page = {
            start: 1,
            current: 1,
            length: this.pageLength.value
        };
        // this.change.emit(this.page);
    }

    setPageLength(length: IPageLength) {
        this.pageLength = length;
        this.page.current = this.page.start
        this.page.length = length.value;
    }

    showMore() {
        this._dropStartPage = false;
        this.page.current++;
    }

    pageChanged(event: any): void {
        if (this._dropStartPage) {
            this.page.start = event.page;
        }
        this.page.current = event.page;
        this._dropStartPage = true;
        this.change.emit(this.page);
    }
}
