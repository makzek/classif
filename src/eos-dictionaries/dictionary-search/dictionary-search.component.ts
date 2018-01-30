import { Component, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';

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

    department = {
        rec: {},
        cabinet: {},
        printInfo: {}
    };

    person = {
        rec: {},
        cabinet: {},
        printInfo: {}
    };

    cabinet = {
        rec: {},
        cabinet: {},
        printInfo: {}
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

    date: Date;

    public mode = 0;

    get noSearchData(): boolean {
        for (const _dict in this[this.currTab || 'data']) {
            if (this[this.currTab || 'data'][_dict]) {
                for (const _field in this[this.currTab || 'data'][_dict]) {
                    if (this[this.currTab || 'data'][_dict][_field] && this[this.currTab || 'data'][_dict][_field].trim() !== '') {
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
        this.dictSubscription = _dictSrv.dictionary$.subscribe((_d) => {
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

        if (_dictSrv.getFilterValue('date')) {
            this.date = new Date(_dictSrv.getFilterValue('date'));
        }
    }

    setTab(key: string) {
        this.currTab = key;
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
                this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
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
                this[this.currTab]['srchMode'] = this.currTab;
            }
            if (this.currTab === 'person') {
                this.person.rec['PHONE_LOCAL'] = this.person.rec['PHONE'];
            }
            this._dictSrv.fullSearch(this[this.currTab || 'data'], this.settings)
                .then(() => {
                    this.searchDone = true;
                    this[this.currTab]['srchMode'] = '';
                });
        } else {
            this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
        }
    }

    clearForm() {
        for (const _field in this[this.currTab || 'data']) {
            if (this[this.currTab || 'data'][_field]) {
                this[this.currTab || 'data'][_field] = {};
            }
        }
    }

    dateFilter(date: Date) {
        if (!this.date || date.getTime() !== this.date.getTime()) {
            this._dictSrv.setFilter({ date: date.setHours(0, 0, 0, 0) });
        }
    }

    public considerDel() {
        this._dictSrv.viewParameters.showDeleted = this.settings.deleted;
        this._dictSrv.shareViewParameters();
    }
}
