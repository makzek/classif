import { Component, Input, Output, EventEmitter, TemplateRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { PopoverDirective } from 'ngx-bootstrap/popover';

import { EosDictService } from '../services/eos-dict.service';
import { E_FIELD_SET, IFieldView, IRecordModeDescription } from '../core/dictionary.interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { ISearchSettings, SEARCH_MODES } from '../core/search-settings.interface';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy {
    @Output() searchResult: EventEmitter<EosDictionaryNode[]> = new EventEmitter<EosDictionaryNode[]>();
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type
    @Output() searchStart: EventEmitter<any> = new EventEmitter(); // event bigin search

    dictId = '';
    fieldsDescription = {};
    data = {
        rec: {},
    };
    settings: ISearchSettings;
    currTab: string;
    modes: IRecordModeDescription[];
    loading = true;
    isOpenFull = false;
    searchDone = true; // Flag search is done, false while not received data

    @ViewChild('full') fSearchPop;
    @ViewChild('quick') qSearchPop;

    isOpenQuick = false;
    dataQuick = '';

    hasDate: boolean;
    hasQuick: boolean;
    hasFull: boolean;

    dictSubscription: Subscription;

    date: Date = new Date();

    public radio = true;

    setTab(key: string) {
        this.currTab = key;
    }

    get noSearchData(): boolean {
        for (const _dict in this.data) {
            if (this.data[_dict]) {
                for (const _field in this.data[_dict]) {
                    if (this.data[_field] !== '') {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService
    ) {
        this.settings = {
            mode: SEARCH_MODES.totalDictionary,
            deleted: false
        };

        this.dictSubscription = this._dictSrv.dictionary$.subscribe((_d) => {
            if (_d) {
                this.loading = false;
                this.dictId = _d.id;
                this.fieldsDescription = _d.descriptor.getFieldDescription(E_FIELD_SET.fullSearch);
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

    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 13) {
            if (!this.searchDone) {
                this._msgSrv.addNewMessage({
                    title: 'Идет поиск!',
                    type: 'warning',
                    msg: 'Пожалуйста подождите.'
                })
            } else {
                this.searchDone = false;
                this.searchStart.emit();
                this._dictSrv.search(this.dataQuick, this.settings)
                    .then((nodes) => {
                        this.searchDone = true;
                        this.searchResult.emit(nodes)
                    })
            }
        }
    }

    clearQuickForm() {
        this.dataQuick = '';
    }

    fullSearch() {
        this.fSearchPop.hide();
        if (this.searchDone) {
            this.searchDone = false;
            this.searchStart.emit();
            console.log(this.data)
            this._dictSrv.fullSearch(this.data, this.settings)
                .then((nodes) => {
                    this.searchDone = true;
                    this.searchResult.emit(nodes);
                });
        } else {
            this._msgSrv.addNewMessage({
                title: 'Идет поиск!',
                type: 'danger',
                msg: 'Пожалуйста подождите.'
            })
        }
    }

    clearForm() {
        for (const _field in this.data) {
            if (this.data[_field]) {
                this.data[_field] = {};
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

    public changeMode(val: boolean) {
        switch (val) {
            case null: this.settings.mode = SEARCH_MODES.totalDictionary;
                break;
            case true: this.settings.mode = SEARCH_MODES.onlyCurrentBranch;
                break;
            case false: this.settings.mode = SEARCH_MODES.currentAndSubbranch;
                break;
        }
    }
}
