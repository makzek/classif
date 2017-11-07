import { Component, Input, Output, EventEmitter, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { ActivatedRoute, Router } from '@angular/router'
import { IListPage, PaginationConfig, IPageLength, PAGES} from './pagination-config.interface';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit, DoCheck, OnDestroy {
    @Input() position: any;
    @Input() total: number;
    @Output() change: EventEmitter<IListPage> = new EventEmitter<IListPage>();

    public config: PaginationConfig = {
        current: 1,
        last: 1,
        pages: []
    }
    private _routerSub;
    readonly pages = PAGES;
    page: IListPage;
    pageLength: IPageLength;

    private _dropStartPage = true;

    constructor(
        private _storageSrv: EosStorageService,
        private _route: ActivatedRoute,
        private _router: Router
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
            this.pageLength = PAGE_SETTING
            this.page.current = this.page.start
            this.page.length = PAGE_SETTING.value
            this.change.emit(this.page)
        } else {
            this.pageLength = this.pages[0]
            this.page.current = this.page.start
            this.page.length = this.pages[0].value
            this.change.emit(this.page)
            this._storageSrv.setItem('PAGE_SETTING', this.pageLength, true)
            this.setPageLength(this.pages[0])
        }
        this._routerSub = this._route.queryParams.subscribe(params => {
            if (params.page && params.items) {
                this.config.current = Number.parseInt(params.page);
                this.pageLength.value = Number.parseInt(params.items);
                this._router.navigate([], {queryParams: {page: this.config.current, items: this.pageLength.value}})
            } else {
                this._router.navigate([], {queryParams: {page: this.config.current, items: this.pageLength.value}})
            }
        });
        this._generatePages();
    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
    }

    ngDoCheck() {
        this._generatePages();
    }

    public setPageLength(length: IPageLength) {
        this.pageLength = length
        this.page.current = this.page.start
        this.page.length = length.value
        this.change.emit(this.page)
        this._storageSrv.setItem('PAGE_SETTING', this.pageLength, true)
        this._router.navigate([], {queryParams: {page: this.config.current, items: this.pageLength.value}})
        this._generatePages()
    }

    public showMore() {
        this._dropStartPage = false;
        this.page.current++;
        this.config.current++;
    }

    public showPage(page: number) {
        this.config.current = page;
        this.page.start = page
        this.page.current = page;
        this.change.emit(this.page);
        this._router.navigate([], {queryParams: {page: this.config.current, items: this.pageLength.value}})
    }

    private _generatePages() {
        if (this.total % this.pageLength.value === 0) {
            this.config.last = (this.total / this.pageLength.value);
        } else {
            this.config.last = Math.floor(this.total / this.pageLength.value) + 1;
        }
        this.config.pages = []
        for (let i = 1, j = 0; i <= this.config.last; i++, j++) {
            this.config.pages[j] = i;
        }
    }

    public visible(i: number): boolean {
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
