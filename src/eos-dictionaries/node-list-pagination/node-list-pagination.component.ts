import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { ActivatedRoute, Router } from '@angular/router'
import { PaginationConfig, IPageLength, PAGES} from './pagination-config.interface';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit, OnDestroy, OnChanges {
    @Input() total: number;

    private _routerSub;
    readonly pages = PAGES;
    public config: PaginationConfig = {
        start: 1,
        current: 1,
        length: 10,
        pageCount: 1,
        pages: []
    }

    constructor(
        private _storageSrv: EosStorageService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        const PAGE_SETTING = this._storageSrv.getItem('PAGE_SETTING')
        if (PAGE_SETTING) {
            this.config.current = this.config.start
            this.config.length = PAGE_SETTING
        } else {
            this.config.current = this.config.start
            this._storageSrv.setItem('PAGE_SETTING', this.pages[0], true)
        }
        this._routerSub = this._route.queryParams.subscribe(params => {
            if (params.length && params.page && params.start) {
                this.config.length  = Number.parseInt(params.length)
                this.config.current = Number.parseInt(params.page)
                this.config.start   = Number.parseInt(params.start)
                this._getPageCount();
                this._generatePages();
            }
        });
     }

    ngOnInit() {
        this._getPageCount();
        this._generatePages();
    }

    ngOnChanges() {
        this._getPageCount();
        this._generatePages();
    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
    }

    public setPageLength(length: number): void {
        this.config.length = length
        this._storageSrv.setItem('PAGE_SETTING', this.config.length, true)
        this._router.navigate([], {queryParams: {
            page: this.config.current,
            length: this.config.length,
            start: this.config.start
        }})
        this._getPageCount();
        this._generatePages()
    }

    public showMore() {
        this.config.current++;
        this._router.navigate([], {queryParams: {
            page: this.config.current,
            length: this.config.length,
            start: this.config.start
        }})
    }

    public showPage(page: number): void {
        this.config.current = page;
        this.config.start = page
        this.config.current = page;
        this._router.navigate([], {queryParams: {
            page: this.config.current,
            length: this.config.length,
            start: this.config.start
        }})
    }

    private _generatePages(): void {
        this.config.pages = []
        for (let i = 1, j = 0; i <= this.config.pageCount; i++, j++) {
            this.config.pages[j] = i;
        }
    }

    private _getPageCount(): void {
        if (this.total % this.config.length === 0) {
            this.config.pageCount = this.total / this.config.length;
        } else {
            this.config.pageCount = Math.floor(this.total / this.config.length) + 1;
        }
    }

    public visible(i: number): boolean {
        if (i === 0 || i === this.config.pageCount - 1) {
            return false;
        } else if (this.config.current === 1 && i < this.config.current + 3) {
            return true;
        } else if (this.config.current === 2 && i < this.config.current + 2) {
            return true;
        } else if (this.config.current > 2 && i >= this.config.current - 2 && i <= this.config.current) {
            return true;
        } else if (this.config.current >= this.config.pageCount - 2 && i >= this.config.pageCount - 4) {
            return true;
        }
    }
}
