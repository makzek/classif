import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { IPaginationConfig, IPageLength } from './node-list-pagination.interfaces';
import { LS_PAGE_LENGTH, PAGES } from './node-list-pagination.consts';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent implements OnInit, OnChanges {
    @Input() total: number;
    @Input() config: IPaginationConfig;
    @Input() currentState: boolean[];
    @Input() hideTree: boolean;

    readonly pageLengths = PAGES;
    private readonly _buttonsTotal = 5;

    pageCount = 1;
    pages: number[] = [];

    constructor(
        private _storageSrv: EosStorageService,
        private _router: Router
    ) { }

    ngOnInit() {
        this._update();
    }

    ngOnChanges() {
        this._update();
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
        if (this.total && this.config) {
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
