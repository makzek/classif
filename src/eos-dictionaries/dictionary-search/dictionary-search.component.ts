import { Component, Input, Output, EventEmitter, TemplateRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { PopoverDirective } from 'ngx-bootstrap/popover';

import { EosDictService } from '../services/eos-dict.service';
import { E_FIELD_SET, IFieldView, IRecordModeDescription } from '../core/dictionary.interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { ISearchSettings } from '../core/search-settings.interface';
import { SEARCH_TYPES } from '../consts/search-types';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy {
    @Output() searchResult: EventEmitter<EosDictionaryNode[]> = new EventEmitter<EosDictionaryNode[]>();
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type

    dictId = '';
    fieldsDescription = {};
    data = {};
    settings: ISearchSettings;
    currTab: string;
    modes: IRecordModeDescription[];
    loading = true;
    isOpenFull = false;

    @ViewChild('full') fSearchPop;
    @ViewChild('quick') qSearchPop;

    isOpenQuick = false;
    dataQuick = '';

    hasDate: boolean;
    hasQuick: boolean;
    hasFull: boolean;

    dictSubscription: Subscription;

    date: Date = new Date();

    setTab(key: string) {
        this.currTab = key;
    }

    get noSearchData(): boolean {
        for (const _field in this.data) {
            if (this.data[_field] !== '') {
                return false;
            }
        }
        return true;
    }

    constructor(
        private _dictSrv: EosDictService,
    ) {
        this.settings = {
            onlyCurrentNode: false,
            subbranches: false,
            deleted: false
        };

        this.dictSubscription = this._dictSrv.dictionary$.subscribe((_d) => {
            if (_d) {
                this.loading = false;
                this.dictId = _d.id;
                this.fieldsDescription = _d.descriptor.getFieldDescription(_d.descriptor.getFieldSet(E_FIELD_SET.fullSearch));
                this.modes = _d.descriptor.getModeList();
                if (this.modes) {
                    this.currTab = this.modes[0].key;
                }

                const _config = _d.descriptor.getSearchConfig();
                /* tslint:disable:no-bitwise */
                this.hasDate = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.dateFilter);
                this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
                this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);
                /* tslint:enable:no-bitwise */
                // console.log('dictionary-search dict update', this.hasDate, this.hasFull, this.hasQuick);
            }
        });
    }

    ngOnDestroy() {
        this.dictSubscription.unsubscribe();
    }

    close(pop: PopoverDirective) {
        pop.hide();
    }


    quickSearch(evt: KeyboardEvent) {
        const _settings = {
            onlyCurrentNode: false,
            subbranches: true,
            deleted: true
        }

        if (evt.keyCode === 13) {
            this._dictSrv.search(this.dataQuick, _settings)
                .then((nodes) => this.searchResult.emit(nodes));
        }
    }

    clearQuickForm() {
        this.dataQuick = '';
    }

    fullSearch() {
        this.fSearchPop.hide();
        this._dictSrv.fullSearch(this.data, this.settings)
            .then((nodes) => this.searchResult.emit(nodes));
    }

    clearForm() {
        for (const _field in this.data) {
            if (this.data[_field]) {
                this.data[_field] = '';
            }
        }
    }

    dateFilter(date: Date) {
        if (date !== this.date) {
            this.date = date;
            this._dictSrv.filter({ date: date }).then(() => {
                console.log('filtered');
            }).catch((err) => { console.log(err) });
        }
    }
}
