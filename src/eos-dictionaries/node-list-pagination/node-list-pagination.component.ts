import { Component, Input, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { IListPage, PaginationConfig, IPageLength, PAGES} from './pagination-config.interface';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit, DoCheck {
    @Input() position: any;
    @Input() total: number;
    @Output() change: EventEmitter<IListPage> = new EventEmitter<IListPage>();
    // NEW CODE
    public config: PaginationConfig = {
        current: 1,
        last: 1,
        pages: []
    }
    //
    readonly pages = PAGES;
    page: IListPage;
    pageLength: IPageLength;

    private _dropStartPage = true;

    constructor(
        private _storageSrv: EosStorageService
    ) { }

    ngOnInit() {
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
        this.generatePages();
    }

    ngDoCheck() {
        this.generatePages();
    }

    setPageLength(length: IPageLength) {
        this.pageLength = length
        this.page.current = this.page.start
        this.page.length = length.value
        this.change.emit(this.page)
        this._storageSrv.setItem('PAGE_SETTING', this.pageLength, true)
        this.generatePages()
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
    showPage(page: number, i?: number) {
        this.config.current = page;
        this.page.start = page
        this.page.current = page;
        this.change.emit(this.page);
    }

    generatePages() {
        console.warn(this.total + ' all elements')
        if (this.total % this.pageLength.value === 0) {
            this.config.last = (this.total / this.pageLength.value);
        } else {
            this.config.last = Math.floor(this.total / this.pageLength.value) + 1;
        }
        console.log(this.config.last + ' all page')
        for (let i = 1, j = 0; i <= this.config.last; i++, j++) {
            this.config.pages[j] = i;
        }
        console.log(this.config.pages)
    }

    visible(i: number): boolean {
        if (i === 0 || i === this.config.last - 1) {
            return false;
        } else if (this.config.current === 1 && i < this.config.current + 3) {
            return true;
        } else if (this.config.current === 2 && i < this.config.current + 2) {
            return true;
        } else if (this.config.current > 2 && i >= this.config.current - 2 && i <= this.config.current) {
            return true;
        } else if (this.config.current >= this.config.last - 2 && i >= this.config.last - 4) {
            return true;
        }
    }
}
