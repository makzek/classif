import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EosStorageService } from '../../app/services/eos-storage.service';

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
    title: '40',
    value: 30
}, {
    title: '100',
    value: 100
}, {
    title: '200',
    value: 200
}];

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit {
    @Input() position: any;
    @Input() total: number;
    @Output() change: EventEmitter<IListPage> = new EventEmitter<IListPage>();
    @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
    // NEW CODE
    public current = 1;
    public pagess = []
    //
    readonly pages = PAGES;
    page: IListPage;
    pageLength: IPageLength;

    private _dropStartPage = true;

    constructor(
        private _storageSrv: EosStorageService
    ) { }

    ngOnInit() {
        this.generatePages();
        this.pageLength = this.pages[0];
        this.page = {
            start: 1,
            current: 1,
            length: this.pageLength.value
        }
        const PAGE_SETTING = this._storageSrv.getItem('PAGE_SETTING')
        if (PAGE_SETTING) {
            this.setPageLength(PAGE_SETTING)
        } else {
            this.setPageLength(this.pages[0])
        }
    }

    setPageLength(length: IPageLength) {
        this.pageLength = length
        this.page.current = this.page.start
        this.page.length = length.value
        this.change.emit(this.page)
        this._storageSrv.setItem('PAGE_SETTING', this.pageLength, true)
    }

    showMore() {
        this._dropStartPage = false;
        this.page.current++;
    }

    pageChanged(event: any): void {
        console.log('pageChanged');
        if (this._dropStartPage) {
            this.page.start = event.page;
        }
        this.page.current = event.page;
        this._dropStartPage = true;
        this.change.emit(this.page);
    }

    // NEW CODE
    showPage(page: number) {
        this.changePage.emit(page);
    }

    generatePages() {
        for (let i = this.total - 3; i <= this.total; i++) {
            this.pagess.push(i);
        }

    }
}
