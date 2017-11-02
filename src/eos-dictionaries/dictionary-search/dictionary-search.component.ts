import { Component, Input, Output, EventEmitter, TemplateRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { E_FIELD_SET, IFieldView, IRecordModeDescription } from '../core/dictionary.interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { ISearchSettings } from '../core/search-settings.interface';
import { SEARCH_TYPES } from '../consts/search-types';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy {
    dictId = '';
    fieldsDescription = {};
    data = {};
    settings: ISearchSettings;
    currTab: string;
    modes: IRecordModeDescription[];
    loading = true;
    isOpenFull = false;
    @ViewChild('searchForm') searchForm;
    @ViewChild('pop') searchPop;

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
        if (this.searchForm) {
            for (const _field in this.searchForm.value) {
                if (this.searchForm.value[_field] && this.searchForm.value[_field] !== '') {
                    return false;
                }
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

    toggleForm() {
        this.isOpenQuick = !this.isOpenQuick;
        this.searchPop.hide();
    }


    quickSearch(evt: KeyboardEvent) {
        const _settings = {
            onlyCurrentNode: false,
            subbranches: true,
            deleted: true
        }

        if (evt.keyCode === 13) {
            this.isOpenQuick = false;
            this._dictSrv.search(this.dataQuick, _settings);
        }
    }

    clearQuickForm() {
        this.dataQuick = '';
    }

    fullSearch() {
        this.searchPop.hide();
        this._dictSrv.fullSearch(this.data, this.settings);
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
            /* this._dictSrv.fullSearch({ date: date }, this.settings); */
        }
    }
}
