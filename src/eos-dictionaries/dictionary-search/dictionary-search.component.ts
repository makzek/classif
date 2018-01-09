import { Component, Input, Output, EventEmitter, TemplateRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { PopoverDirective } from 'ngx-bootstrap/popover';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IFieldView, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy {
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type

    dictId = '';
    fieldsDescription = {
        rec: {}
    };
    data = {
        rec: {},
        cabinet: {},
        printInfo: {},
    };
    public settings: ISearchSettings = {
        mode: SEARCH_MODES.totalDictionary,
        deleted: false
    };
    currTab: string;
    modes: IRecordModeDescription[];
    loading = true;
    isOpenFull = false;
    searchDone = true; // Flag search is done, false while not received data

    @ViewChild('full') fSearchPop;
    @ViewChild('quick') qSearchPop;

    isOpenQuick = false;
    dataQuick = null;

    hasDate: boolean;
    hasQuick: boolean;
    hasFull: boolean;
    type: E_DICT_TYPE;

    dictSubscription: Subscription;

    date: Date = new Date();

    public mode = 0;

    setTab(key: string) {
        this.currTab = key;
    }

    get noSearchData(): boolean {
        for (const _dict in this.data) {
            if (this.data[_dict]) {
                for (const _field in this.data[_dict]) {
                    if (this.data[_dict][_field] && this.data[_dict][_field].trim() !== '') {
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
        this.dictSubscription = this._dictSrv.dictionary$.subscribe((_d) => {
            if (_d) {
                this.loading = false;
                this.dictId = _d.id;
                if (this.dictId) {
                    Object.assign(this.data, {
                        printInfo: {},
                        cabinet: {}
                    });
                }
                this.fieldsDescription = _d.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
                this.type = _d.descriptor.dictionaryType;
                this.modes = _d.descriptor.record.getModeList();
                if (this.modes) {
                    this.currTab = this.modes[0].key;
                }

                const _config = _d.descriptor.record.getSearchConfig();
                // console.log('search config', _config);
                /* tslint:disable:no-bitwise */
                this.hasDate = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.dateFilter);
                this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
                this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);
                /* tslint:enable:no-bitwise */
                // console.log('dictionary-search dict update', this.hasDate, this.hasFull, this.hasQuick);
            }
        });
    }

    public setFocus() {
        document.getElementById('inpQuick').focus();
    }

    ngOnDestroy() {
        this.dictSubscription.unsubscribe();
    }

    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 13) {
            if (this.searchDone) {
                this.dataQuick = (this.dataQuick) ? this.dataQuick.trim() : '';
                if (this.dataQuick !== '') {
                    this.searchDone = false;
                    this.settings.deleted = this._dictSrv.viewParameters.showDeleted;
                    this._dictSrv.search(this.dataQuick, this.settings)
                        .then(() => this.searchDone = true);
                }
            } else {
                this._msgSrv.addNewMessage({
                    title: 'Идет поиск!',
                    type: 'warning',
                    msg: 'Пожалуйста подождите.'
                })
            }
        }
    }

    clearQuickForm() {
        this.dataQuick = '';
    }

    fullSearch() {
        if (this.mode === 0) {
            this.settings.mode = SEARCH_MODES.totalDictionary;
        } else if (this.mode === 1) {
            this.settings.mode = SEARCH_MODES.onlyCurrentBranch;
        } else if (this.mode === 2) {
            this.settings.mode = SEARCH_MODES.currentAndSubbranch;
        }

        this.fSearchPop.hide();
        if (this.searchDone) {
            this.searchDone = false;
            if (this.dictId === 'departments') {
                this.data['srchMode'] = this.currTab;
            }
            this._dictSrv.fullSearch(this.data, this.settings)
                .then((nodes) => {
                    this.searchDone = true;
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
            this._dictSrv.filter({ date: date })
                .then(() => {
                    console.log('filtered');
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }

    public considerDel() {
        this._dictSrv.viewParameters.showDeleted = this.settings.deleted;
        this._dictSrv.shareViewParameters();
    }
}
