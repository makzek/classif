import { Component, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';
import { FormGroup } from '@angular/forms';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { InputControlService } from 'eos-common/services/input-control.service';

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
    @Output() switchFastSrch: EventEmitter<boolean> = new EventEmitter();

    filterInputs = [{
        controlType: 'date',
        key: 'filterDate',
        value: new Date(),
        label: 'Состояние на',
        hideLabel: true,
        readonly: false
    }];

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

    aForm: FormGroup;
    inputs: InputBase<any>[];

    date: Date = new Date();

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
        private _msgSrv: EosMessageService,
        private inputCtrlSrv: InputControlService,
    ) {
        ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));

        this.inputs = this.inputCtrlSrv.generateInputs(this.filterInputs);
        this.aForm = this.inputCtrlSrv.toFormGroup(this.inputs, false);

        this.aForm.valueChanges.subscribe((data) => {
            // console.log(data);
        });

        this.dictSubscription = _dictSrv.dictionary$.subscribe((_d) => {
            if (_d) {
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
                if (this.dictId === 'departments') {
                    if (_dictSrv.getFilterValue('date')) {
                        this.date = new Date(_dictSrv.getFilterValue('date'));
                    } else {
                        this.dateFilter(new Date());
                    }
                }
            }
        });
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
        if (date instanceof Date) {
            if (!this.date || date.getTime() !== this.date.getTime()) {
                this.date = date;
                this._dictSrv.setFilter({ date: date ? date.setHours(0, 0, 0, 0) : null });
            }
        } else {
            // drop filter
            // this.date = new Date();
        }
    }

    showFastSrch() {
        this.isOpenQuick = !this.isOpenQuick;
        this.switchFastSrch.emit(this.isOpenQuick);
    }

    public considerDel() {
        this._dictSrv.updateViewParameters({ showDeleted: this.settings.deleted });
    }

    private clearModel(model: string) {
        this.mode = 0;
        this.settings.deleted = false;
        this[model] = {};
        Object.keys(SEARCH_MODEL).forEach((key) => this[model][key] = {});
    }
}
