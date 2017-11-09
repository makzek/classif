import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { IPaginationConfig, IPageLength } from './node-list-pagination.interfaces';
import { LS_PAGE_LENGTH, PAGES } from './node-list-pagination.consts';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit, OnDestroy, OnChanges {
    @Input() total: number;
    @Output() pageChanged: EventEmitter<IPaginationConfig> = new EventEmitter<IPaginationConfig>();

    private _routerSub;
    readonly pageLengths = PAGES;
    private readonly _buttonsTotal = 5;

    public config: IPaginationConfig = {
        start: 1,
        current: 1,
        length: 10,
    }

    pageCount = 1;
    pages: number[] = [];

    constructor(
        private _storageSrv: EosStorageService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        const pageLength = this._getPage(this._storageSrv.getItem(LS_PAGE_LENGTH) || 1);

        this.config.length = pageLength.value;

        this._routerSub = this._route.queryParams.subscribe(params => {
            let update = false;
            if (params.length) {
                this.config.length = this._getPage(this._positive(params.length)).value;
                update = true;
            }
            if (params.page) {
                this.config.current = this._positive(params.page);
                update = true;
            }
            if (params.start) {
                this.config.start = this._positive(params.start);
                update = true;
            }
            if (update) {
                this.pageChanged.emit(this.config);
                this._update();
            }
        });
    }

    private _positive(val: any): number {
        let res = val * 1 || 1;
        if (res < 1) {
            res = 1;
        }
        return Math.floor(res);
    }

    private _getPage(length: number) {
        return PAGES.find((item) => item.value >= length) || PAGES[0];
    }

    ngOnInit() {
        this._update();
        this.pageChanged.emit(this.config);
    }

    ngOnChanges() {
        this._update();
    }

    ngOnDestroy() {
        this._routerSub.unsubscribe();
    }

    public setPageLength(length: number): void {
        this._storageSrv.setItem(LS_PAGE_LENGTH, length, true)
        this._router.navigate([], {
            queryParams: {
                page: this.config.current,
                length: length,
                start: this.config.start
            }
        })
    }

    public showMore() {
        this._router.navigate([], {
            queryParams: {
                page: this.config.current + 1,
                length: this.config.length,
                start: this.config.start
            }
        })
    }

    public showPage(page: number): void {
        if (page !== this.config.current) {
            this._router.navigate([], {
                queryParams: {
                    page: page,
                    length: this.config.length,
                    start: page
                }
            })
        }
    }

    private _update() {
        if (this.total) {
            const total = Math.ceil(this.total / this.config.length);
            const firstSet = this._buttonsTotal - this.config.current;
            const lastSet = total - this._buttonsTotal + 1;
            const middleSet = this._buttonsTotal - 3;

            this.pageCount = total;
            this.pages = [];
            for (let i = 1; i <= this.pageCount; i++) {
                if (
                    i === 1 || i === this.pageCount || // first & last pages
                    (1 < firstSet && i < this._buttonsTotal) || // first 4 pages
                    (1 < this.config.current - lastSet && i - lastSet > 0) || // last 4 pages
                    (middleSet > this.config.current - i && i - this.config.current < middleSet)  // middle pages
                ) {
                    this.pages.push(i);
                }
            }
        }
    }

}
