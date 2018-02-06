import { Component, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';

const SEARCH_MODEL = {
    rec: {},
    cabinet: {},
    printInfo: {}
};

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
    data: any;
    department: any;
    person: any;
    cabinet: any;

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
        const model = this[this.currTab || 'data'];
        let noData = true;
        Object.keys(model).forEach((_dict) => {
            Object.keys(model[_dict]).forEach((_field) => {
                if (model[_dict][_field] && model[_dict][_field].trim() !== '') {
                    noData = false;
                }
            });
        });
        return noData;
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService
    ) {
        ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));

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
        this.settings.mode = this.mode;
        this.fSearchPop.hide();
        if (this.searchDone) {
            this.searchDone = false;
            if (this.dictId === 'departments') {
                this[this.currTab]['srchMode'] = this.currTab;
            }
            this._dictSrv.fullSearch(this[this.currTab || 'data'], this.settings)
                .then(() => {
                    this.searchDone = true;
                    if (this.dictId === 'departments') {
                        this[this.currTab]['srchMode'] = '';
                    }
                });
        } else {
            this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
        }
    }

    clearForm() {
        this.clearModel(this.currTab || 'data');
    }

    dateFilter(date: Date) {
        if (!this.date || date.getTime() !== this.date.getTime()) {
            this._dictSrv.setFilter({ date: date.setHours(0, 0, 0, 0) });
        }
    }

    public considerDel() {
        this._dictSrv.updateViewParameters({ showDeleted: this.settings.deleted });
    }

    private clearModel(model: string) {
        this[model] = {};
        Object.keys(SEARCH_MODEL).forEach((key) => this[model][key] = {});
    }
}
