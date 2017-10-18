import { Component, Input, Output, EventEmitter, TemplateRef, HostListener, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET, IRecordModeDescription } from '../core/dictionary-descriptor';
import { EosDictionary } from '../core/eos-dictionary';
import { SearchSettings } from '../core/search-settings.interface';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent {
    dictId = '';
    fieldsDescription = {};
    data = {};
    settings: SearchSettings;
    currTab: string;
    modes: IRecordModeDescription[];
    loading = true;
    isOpenFull = false;
    @ViewChild('searchForm') searchForm;
    @ViewChild('pop') searchPop;

    isOpenQuick = false;
    dataQuick = '';

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
        this._dictSrv.dictionary$.subscribe((_d) => {
            if (_d) {
                this.loading = false;
                this.dictId = _d.id;
                this.fieldsDescription = _d.descriptor.getFieldDescription(_d.descriptor.getFieldSet(E_FIELD_SET.fullSearch));
                this.modes = _d.descriptor.getModeList();
                if (this.modes) {
                    this.currTab = this.modes[0].key;
                }
            }
        });
    }

    toggleForm() {
        this.isOpenQuick = !this.isOpenQuick;
    }


    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 13) {
            this.isOpenQuick = false;
            this._dictSrv.search(this.dataQuick, this.settings);
         }
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
        // this._dictSrv.dateFilter(date, this.settings);
    }
}
